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

    // 1. EARLY RETURN: Check if order already exists (Handles reloads & race conditions)
    const existingOrder = await prisma.order.findUnique({
      where: { paymentId: cashfreeOrderId },
      include: { items: true }
    });
    
    // If order is found, return it immediately and bypass cart/address logic
    if (existingOrder) return existingOrder;

    // 2. Validate data for new order creation
    if (!address) throw new Error("Order details missing. Please check your history.");

    const user = await prisma.user.findUnique({ where: { id: userId } });

    return await prisma.$transaction(async (tx: any) => {
      // 3. Double-check inside transaction (Serializable-safe)
      const duplicateCheck = await tx.order.findUnique({
        where: { paymentId: cashfreeOrderId }
      });
      if (duplicateCheck) return duplicateCheck;

      let itemsToOrder = [];
      let subtotal = 0;

      if (productId) {
        const p = await tx.product.findUnique({ where: { id: productId } });
        if (!p) throw new Error("Product not found");
        itemsToOrder.push({ productId: p.id, name: p.name, price: p.price, quantity: 1 });
        subtotal = p.price;
      } else {
        const cart = await tx.cart.findUnique({ 
          where: { userId }, 
          include: { items: { include: { product: true } } } 
        });
        if (!cart || cart.items.length === 0) throw new Error("Cart empty");
  
        itemsToOrder = cart.items.map((i: CartItem) => ({
          productId: i.productId,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity
        }));
        subtotal = cart.items.reduce((acc: any, i:any) => acc + (i.product.price * i.quantity), 0);
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      const savings = subtotal * 0.10;
      const gst = subtotal * 0.18;
      const delivery = subtotal > 2000 ? 0 : 40;
      const finalAmount = subtotal - savings - (discountAmount || 0) + gst + delivery;

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