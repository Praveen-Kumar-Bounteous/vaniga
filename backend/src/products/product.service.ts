import { prisma } from '../lib/prisma.js';

export class ProductService {

    static async getCategories() {
    // 1. Get distinct categories
    const categories = await prisma.product.findMany({
        where: { isActive: true },
        select: { category: true },
        distinct: ['category'],
    });

    // 2. For each category, get one sample image
    const categoryData = await Promise.all(
        categories.map(async (cat: any) => {
            const product = await prisma.product.findFirst({
                where: { category: cat.category, isActive: true },
                select: { images: true }
            });
            return {
                name: cat.category,
                image: product?.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000" // Fallback
            };
        })
    );

    return categoryData;
}

    // PUBLIC: Get all active products
static async getAll(category?: string, limit: number = 8, skip: number = 0, search?: string, minPrice?: number, maxPrice?: number) {
    return prisma.product.findMany({
        where: {
            isActive: true,
            ...(category && { category }),
            ...(search && { name: { contains: search, mode: 'insensitive' } }),
            ...( (minPrice || maxPrice) && {
                price: {
                    gte: minPrice || 0,
                    lte: maxPrice || 9999999
                }
            })
        },
        take: limit,
        skip: skip,
        include: { seller: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });
}
    // PUBLIC: Get single product
    static async getOne(id: string) {
        const product = await prisma.product.findUnique({ 
            where: { id },
            include: { seller: { select: { name: true } } }
        });
        if (!product || !product.isActive) throw new Error('Product not found');
        return product;
    }

    // Get Related Products (Same category, limited to 4, excluding current)
    static async getRelated(category: string, excludeId: string) {
        return prisma.product.findMany({
            where: {
                category,
                id: { not: excludeId },
                isActive: true
            },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });
    }
    
    // SELLER ONLY: Create
    static async create(data: any, sellerId: string) {
        return prisma.product.create({
            data: { ...data, sellerId }
        });
    }

    // SELLER ONLY: Update (with ownership check)
    static async update(id: string, sellerId: string, data: any, role: string) {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) throw new Error('Product not found');
        // Only seller who owns it can update
        if (product.sellerId !== sellerId && role !== 'ADMIN') {
            throw new Error('Not authorized to update this product');
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error("No update data provided");
        }

        return prisma.product.update({
            where: { id },
            data: data
        });
    }

    // SELLER/ADMIN: Soft Delete
    static async softDelete(id: string, userId: string, role: string) {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) throw new Error('Product not found');

        // Admin can delete anything, Seller can only delete their own
        if (role !== 'ADMIN' && product.sellerId !== userId) {
            throw new Error('Not authorized to delete this product');
        }

        // Soft delete: Set isActive to false
        return prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    }
}