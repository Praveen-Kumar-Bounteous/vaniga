import apiClient from '../API/api-client';

export const fetchCartAPI = () => apiClient.get('/cart').then(res => res.data.data);
export const addToCartAPI = (productId: string, quantity: number = 1) => apiClient.post('/cart', { productId, quantity });
export const updateQuantityAPI = (itemId: string, quantity: number) => apiClient.patch(`/cart/${itemId}`, { quantity });
export const removeFromCartAPI = (itemId: string) => apiClient.delete(`/cart/${itemId}`);