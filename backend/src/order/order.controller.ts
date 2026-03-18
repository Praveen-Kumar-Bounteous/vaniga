import { Request, Response } from 'express';
import { OrderService } from './order.service.js';

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { totalAmount, email, phone, name, address, productId, couponCode, discountAmount } = req.body;

    if (!email || !phone || !totalAmount || !address) {
      return res.status(400).json({ success: false, message: "Missing required details (Email, Phone, and Address are required)" });
    }

    // Now passes full data to create the PENDING order record first
    const data = await OrderService.initiatePayment(userId, {
      totalAmount, email, phone, name, address, productId, couponCode, discountAmount
    });
    
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    // req.body only needs { cashfreeOrderId } now
    const order = await OrderService.finalizeOrder(userId, req.body.cashfreeOrderId);
    
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const orders = await OrderService.getHistory(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};