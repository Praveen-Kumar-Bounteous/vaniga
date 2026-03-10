import apiClient from '../API/api-client';

export const loginAPI = (data: any) => apiClient.post('/auth/login', data);
export const signupAPI = (data: any) => apiClient.post('/auth/signup', data);
export const logoutAPI = () => apiClient.post('/auth/logout');