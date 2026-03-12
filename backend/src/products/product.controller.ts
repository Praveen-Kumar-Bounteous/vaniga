import { Request, Response } from 'express';
import { ProductService } from './product.service.js';

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await ProductService.getCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    const category = req.query.category as string;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = parseInt(req.query.skip as string) || 0;

    const products = await ProductService.getAll(category, limit, skip);
    res.json({ success: true, data: products });
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const product = await ProductService.create(req.body, user.userId);
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { userId, role } = (req as any).user;
        const productId = req.params.id as string;

        if (!productId) {
            return res.status(400).json({ message: "Product id is required" });
        }

        const product = await ProductService.update(
            productId,
            userId,
            req.body,
            role
        );

        res.json({
            success: true,
            data: product
        });

    } catch (error: any) {
        res.status(403).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { userId, role } = (req as any).user;
        await ProductService.softDelete(req.params.id as string, userId, role);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        res.status(403).json({ message: error.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const productID = req.params.id as string;
        const product = await ProductService.getOne(productID);
        const related = await ProductService.getRelated(product.category, product.id);
        
        res.json({ 
            success: true, 
            data: { product, related } 
        });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};  