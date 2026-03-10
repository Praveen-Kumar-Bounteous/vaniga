import { prisma } from '../lib/prisma';

export class CartService {
  // Get cart belonging to specific user
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { updatedAt: 'desc' }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }
    return cart;
  }

  // Add/Update Item
  static async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);
    const existingItem = cart.items.find(i => i.productId === productId);

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity }
    });
  }

  // Update specific item quantity
  static async updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) return this.removeItem(itemId);
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  // Delete item
  static async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }
}