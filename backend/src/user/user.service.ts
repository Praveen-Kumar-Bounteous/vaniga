import { prisma } from '../lib/prisma.js';

export class UserService {
  static async getFullDashboard(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        address: true,
        // Fetch Orders + Items (Bills)
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' }
        },
        // Fetch Cart Items
        cart: {
          include: {
            items: { include: { product: true } }
          }
        }
      }
    });
  }

static async updateDetails(userId: string, data: any) {
  const { name, address } = data;
  
  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      address: {
        upsert: {
          create: {
            street: address.street || "",
            city: address.city || "",
            state: address.state || "", // FIX: Added state
            zip: address.zip || "",
            country: address.country || "India", // Ensure country is present if required
          },
          update: {
            street: address.street,
            city: address.city,
            state: address.state, // FIX: Added state
            zip: address.zip,
          },
        },
      },
    },
  });
}
}