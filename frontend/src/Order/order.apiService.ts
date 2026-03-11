import apiClient from '../API/api-client';

export const initiatePaymentAPI = (paymentData: { 
  totalAmount: number; 
  userId: string; 
  email: string; 
  phone: string; 
  name: string; 
}) => apiClient.post('/orders/initiate-payment', paymentData);

export const confirmOrderAPI = (data: { address: any; productId?: string }) => 
    apiClient.post('/orders/confirm', data);

export const fetchOrderHistoryAPI = () => 
    apiClient.get('/orders/history').then(res => res.data.data);