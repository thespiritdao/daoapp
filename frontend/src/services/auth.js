import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const setToken = (token) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

const login = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { userId });
    const { token, address, hasMembership } = response.data;
    setToken(token);
    return { success: true, address, hasMembership };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.response?.data?.message || 'An error occurred during login' };
  }
};

const logout = () => {
  removeToken();
};

const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

const verifyToken = async () => {
  const token = getToken();
  if (!token) return { isValid: false };

  try {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Token verification error:', error);
    removeToken();
    return { isValid: false, error: 'Invalid token' };
  }
};

export const AuthService = {
  login,
  logout,
  isAuthenticated,
  verifyToken,
  getToken,
};