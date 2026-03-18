import { prisma } from '../lib/prisma.js';
import axios from 'axios';
import { sendOrderConfirmation } from '../utils/mailer.js';

export type CartItem = {
  productId: string
  quantity: number
  product: {
    name: string
    price: number
  }
}

export class OrderService {

  static async initiatePayment(userId: string, totalAmount: number, email: string, phone: string, name: string) {
    const orderId = `order_${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders',
      {
        order_id: orderId,
        order_amount: Math.round(totalAmount * 100) / 100,
        order_currency: "INR",
        customer_details: {
          customer_id: userId,
          customer_email: email,
          customer_phone: phone,
          customer_name: name
        },
        order_meta: {
          return_url: `${frontendUrl}/order-success?order_id={order_id}`
        }
      },
      {
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01'
        }
      }
    );

    return {
      payment_session_id: response.data.payment_session_id,
      order_id: orderId
    };
  }

static async finalizeOrder(userId: string, data: any) {
  const { address, productId, cashfreeOrderId, couponCode, discountAmount } = data;

  // 1. Check if order already exists (handles reloads)
  const existingOrder = await prisma.order.findUnique({
    where: { paymentId: cashfreeOrderId },
    include: { items: true }
  });

  if (existingOrder) return existingOrder;

  if (!address) throw new Error("Shipping address is required");

  const user = await prisma.user.findUnique({ where: { id: userId } });

  // Use a transaction: If the order creation fails, the cart deletion is ROLLED BACK automatically.
  return await prisma.$transaction(async (tx: any) => {
    
    // Double-check for duplicate inside transaction
    const duplicateCheck = await tx.order.findUnique({ where: { paymentId: cashfreeOrderId } });
    if (duplicateCheck) return duplicateCheck;

    let itemsToOrder = [];
    let subtotal = 0;

    if (productId) {
      // --- SCENARIO: BUY NOW ---
      const p = await tx.product.findUnique({ where: { id: productId } });
      if (!p) throw new Error("Product not found");
      
      itemsToOrder.push({ productId: p.id, name: p.name, price: p.price, quantity: 1 });
      subtotal = p.price;

      // REMOVE ONLY THIS ITEM from the cart if it exists there
      const userCart = await tx.cart.findUnique({ where: { userId } });
      if (userCart) {
        await tx.cartItem.deleteMany({
          where: {
            cartId: userCart.id,
            productId: productId
          }
        });
      }
    } else {
      // --- SCENARIO: CHECKOUT FROM CART ---
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }
      });
      
      if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

      itemsToOrder = cart.items.map((i: any) => ({
        productId: i.productId,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      }));
      
      subtotal = cart.items.reduce((acc: any, i: any) => acc + (i.product.price * i.quantity), 0);

      // CLEAR THE WHOLE CART
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    // Calculations
    const savings = subtotal * 0.10;
    const gst = subtotal * 0.18;
    const delivery = subtotal > 2000 ? 0 : 40;
    const finalAmount = subtotal - savings - (discountAmount || 0) + gst + delivery;

    // Create the Order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: Math.round(finalAmount * 100) / 100,
        status: "PROCESSING",
        paymentStatus: "paid",
        paymentId: cashfreeOrderId,
        customMessage: address.customMessage || "",
        shippingAddress: { ...address, couponCode: couponCode || "NONE" },
        items: { create: itemsToOrder }
      },
      include: { items: true }
    });

    // Send Email
    if (user?.email) {
      sendOrderConfirmation(user.email, user.name, order).catch(err => console.error("Mail Error:", err));
    }

    return order;
  }, { isolationLevel: 'Serializable' });
}

  static async getHistory(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}