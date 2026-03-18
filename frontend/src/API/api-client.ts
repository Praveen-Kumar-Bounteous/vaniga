import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Define routes that should NEVER trigger a refresh attempt
    const isAuthRoute = 
      originalRequest.url.includes('/auth/login') || 
      originalRequest.url.includes('/auth/signup') || 
      originalRequest.url.includes('/auth/refresh');

    // 2. Only attempt refresh if:
    //    - Status is 401
    //    - We haven't retried this request yet
    //    - It IS NOT a login/signup/refresh request
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user must log in again
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 3. If a 401 happens on the refresh route itself, go to login
    if (error.response?.status === 401 && originalRequest.url.includes('/auth/refresh')) {
      window.location.href = '/login';
    }

    // 4. IMPORTANT: For Login/Signup 401s, just return the error 
    // so the UI can show "Invalid email or password"
    return Promise.reject(error);
  }
);

export default apiClient;