import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const login = (userId) => api.post('/auth/login', { userId });
export const verifyToken = () => api.get('/auth/verify');
export const getCart = () => api.get('/shop/cart');
export const addToCart = (productId, quantity) => api.post('/shop/cart/add', { productId, quantity });
export const removeFromCart = (productId) => api.delete(`/shop/cart/remove/${productId}`);
export const checkout = (paymentMethod, shippingAddress) => api.post('/shop/checkout', { paymentMethod, shippingAddress });
export const getOrders = () => api.get('/shop/orders');
export const getOrder = (orderId) => api.get(`/shop/orders/${orderId}`);

export default api;