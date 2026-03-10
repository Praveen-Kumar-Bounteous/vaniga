import { Request, Response } from 'express';
import { CartService } from './cart.service.js';

export const getCart = async (req: Request, res: Response) => {
  const cart = await CartService.getCart((req as any).user.userId);
  res.json({ success: true, data: cart });
};

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  await CartService.addItem((req as any).user.userId, productId, quantity || 1);
  res.json({ success: true, message: "Item added to cart" });
};

export const updateCartItem = async (req: Request, res: Response) => {
  await CartService.updateQuantity(req.params.itemId as string, req.body.quantity);
  res.json({ success: true, message: "Quantity updated" });
};

export const removeFromCart = async (req: Request, res: Response) => {
  await CartService.removeItem(req.params.itemId as string);
  res.json({ success: true, message: "Item removed" });
};