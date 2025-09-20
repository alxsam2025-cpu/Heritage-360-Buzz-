// API Configuration for Heritage 360 Buzz
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Hotel Management
  ROOMS: '/hotel/rooms',
  BOOKINGS: '/hotel/bookings',
  
  // Restaurant Management  
  RESTAURANT_MENU: '/restaurant/menu',
  RESTAURANT_ORDERS: '/restaurant/orders',
  
  // Pub Management
  PUB_MENU: '/pub/menu', 
  PUB_ORDERS: '/pub/orders',
  
  // Accounting
  TRANSACTIONS: '/accounting/transactions',
  REPORTS: '/accounting/reports',
  
  // Inventory
  INVENTORY: '/inventory',
  
  // Users
  USERS: '/users'
};

// Axios instance configuration
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;