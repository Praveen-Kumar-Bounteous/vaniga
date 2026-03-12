import apiClient from '../API/api-client';

interface FetchProductsParams {
  category?: string;
  pageParam?: number;
  search?: string;
}

export const fetchProductsAPI = async ({ category, pageParam = 0, search }: FetchProductsParams) => {
  const limit = 8;
  let url = `/products?skip=${pageParam}&limit=${limit}`;
  
  // URL Encode the category to handle special characters like '&'
  if (category && category !== 'all') {
    const encodedCategory = encodeURIComponent(category);
    url += `&category=${encodedCategory}`;
  }
  
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await apiClient.get(url);
  return response.data.data;
};

/**
 * Fetch unique product categories for the Home Page
 */
export const fetchCategoriesAPI = () => {
  return apiClient.get('/products/categories');
};

/**
 * Fetch a single product detail by ID and also related prodict
 */
export const fetchProductDetailsAPI = async (id: string) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data.data; // Returns { product, related }
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