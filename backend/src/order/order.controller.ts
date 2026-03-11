import { Request, Response } from 'express';
import axios from 'axios';
import { OrderService } from './order.service.js';

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { totalAmount, userId, email, phone, name } = req.body;

    if (!email || !phone || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required details" });
    }

    // Call the Service instead of re-writing axios code here
    const data = await OrderService.initiatePayment(userId, totalAmount, email, phone, name);
    
    res.json({ success: true, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    // req.body contains { address, productId, cashfreeOrderId, couponCode, discountAmount }
    const order = await OrderService.finalizeOrder(userId, req.body);
    
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