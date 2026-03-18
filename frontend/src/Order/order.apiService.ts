import apiClient from '../API/api-client';

export const initiatePaymentAPI = (paymentData: { 
  totalAmount: number; 
  userId: string; 
  email: string; 
  phone: string; 
  name: string; 
}) => apiClient.post('/orders/initiate-payment', paymentData);

export interface ConfirmOrderPayload {
  cashfreeOrderId: string;
  address?: any;       
  productId?: string;
  couponCode?: string;
  discountAmount?: number;
}

export const confirmOrderAPI = (payload: ConfirmOrderPayload) => {
  return apiClient.post('/orders/confirm', payload);
};

export const fetchOrderHistoryAPI = () => 
    apiClient.get('/orders/history').then(res => res.data.data);