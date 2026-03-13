import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 AND we haven't retried yet 
    // AND the request wasn't already trying to refresh the token
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/refresh') // <--- CRITICAL CHECK
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails (401 or 403), the session is dead. Redirect to login.
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If it's a 401 on the refresh route itself, just redirect
    if (error.response?.status === 401 && originalRequest.url.includes('/auth/refresh')) {
        window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;