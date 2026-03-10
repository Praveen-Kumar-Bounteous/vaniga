import { Router } from 'express';
import * as productController from './product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';

const productRoutes = Router();

// PUBLIC ROUTES
productRoutes.get('/categories', productController.getCategories); 
productRoutes.get('/', productController.getProducts);

// PROTECTED ROUTES
productRoutes.post('/', 
    protect, 
    restrictTo('SELLER', 'ADMIN'), 
    productController.createProduct
);

productRoutes.put('/:id', 
    protect, 
    restrictTo('SELLER', 'ADMIN'), 
    productController.updateProduct
);

productRoutes.delete('/:id', 
    protect, 
    restrictTo('SELLER', 'ADMIN'), 
    productController.deleteProduct
);

export default productRoutes;