import { prisma } from '../lib/prisma.js';
import axios from 'axios';
import { sendOrderConfirmation } from '../utils/mailer.js';

export class OrderService {
  static async initiatePayment(userId: string, orderData: any) {
    const { totalAmount, email, phone, name, address, productId, couponCode, discountAmount } = orderData;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // 1. Create the Order in DB with 'pending' status BEFORE payment
    const order = await prisma.$transaction(async (tx: any) => {
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
        itemsToOrder = cart.items.map((i: any) => ({
          productId: i.productId,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity
        }));
        subtotal = cart.items.reduce((acc: any, i: any) => acc + (i.product.price * i.quantity), 0);
      }

      return await tx.order.create({
        data: {
          userId,
          totalAmount: Math.round(totalAmount * 100) / 100,
          status: "PENDING",
          paymentStatus: "pending",
          paymentId: `temp_${Date.now()}`, // Temporary ID until Cashfree confirms
          customMessage: address.customMessage || "",
          shippingAddress: { ...address, couponCode: couponCode || "NONE", discountAmount: discountAmount || 0 },
          items: { create: itemsToOrder }
        }
      });
    });

    // 2. Call Cashfree using our Database Order ID
    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders',
      {
        order_id: order.id, // Use Prisma Order ID
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
      order_id: order.id
    };
  }

  static async finalizeOrder(userId: string, cashfreeOrderId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // 1. Find the existing pending order
    const existingOrder = await prisma.order.findUnique({
      where: { id: cashfreeOrderId },
      include: { items: true }
    });

    if (!existingOrder) throw new Error("Order record not found");

    // 2. If already processed, just return it
    if (existingOrder.paymentStatus === 'paid') {
        return existingOrder;
    }

    // 3. Update Order to PAID and clear cart
    return await prisma.$transaction(async (tx: any) => {
      const updatedOrder = await tx.order.update({
        where: { id: cashfreeOrderId },
        data: {
          paymentStatus: "paid",
          status: "PROCESSING",
          paymentId: cashfreeOrderId // Sync final ID
        },
        include: { items: true }
      });

      // Clear cart items for this user
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      // Send Email
      if (user?.email) {
        sendOrderConfirmation(user.email, user.name, updatedOrder).catch(err => console.error("Mail Error:", err));
      }

      return updatedOrder;
    });
  }

  static async getHistory(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}