import apiClient from '../API/api-client';

/**
 * Fetch all products with optional category filtering
 */
export const fetchProductsAPI = ({ category, pageParam = 0 }: { category?: string, pageParam?: number }) => {
  const limit = 8;
  const url = `/products?skip=${pageParam}&limit=${limit}${category ? `&category=${category}` : ''}`;
  return apiClient.get(url).then(res => res.data.data);
};

/**
 * Fetch unique product categories for the Home Page
 */
export const fetchCategoriesAPI = () => {
  return apiClient.get('/products/categories');
};

/**
 * Fetch a single product detail by ID
 */
export const fetchProductByIdAPI = (id: string) => {
  return apiClient.get(`/products/${id}`);
};

/**
 * Seller/Admin: Create a new product
 */
export const createProductAPI = (data: any) => {
  return apiClient.post('/products', data);
};

/**
 * Seller/Admin: Delete a product (Soft delete)
 */
export const deleteProductAPI = (id: string) => {
  return apiClient.delete(`/products/${id}`);
};