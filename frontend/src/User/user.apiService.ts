import apiClient from '../API/api-client';

/**
 * Fetches full user profile including orders, cart items, and address
 * Used for the Tabbed Profile Dashboard
 */
export const fetchProfileAPI = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data.data;
};

/**
 * Updates basic profile info and address
 * @param data - { name: string, address: { street, city, state, zip } }
 */
export const updateProfileAPI = async (data: any) => {
  const response = await apiClient.patch('/users/edit-profile', data);
  return response.data;
};