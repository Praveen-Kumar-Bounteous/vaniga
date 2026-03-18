import apiClient from '../API/api-client';

export const initiatePaymentAPI = (paymentData: { 
  totalAmount: number; 
  userId: string; 
  email: string; 
  phone: string; 
  name: string; 
  address: any;      // Added address
  productId?: string;
  couponCode?: string;
  discountAmount?: number;
}) => apiClient.post('/orders/initiate-payment', paymentData);

export const confirmOrderAPI = (cashfreeOrderId: string) => {
  return apiClient.post('/orders/confirm', { cashfreeOrderId });
};

export const fetchOrderHistoryAPI = () => 
    apiClient.get('/orders/history').then(res => res.data.data);