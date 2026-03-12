import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promo) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (!promo.isActive) {
      return res.status(400).json({ success: false, message: "This coupon is no longer active" });
    }

    if (new Date(promo.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    }

    res.json({ 
      success: true, 
      discount: promo.discount,
      code: promo.code 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};