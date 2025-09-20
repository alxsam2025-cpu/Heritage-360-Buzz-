import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load token from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('heritage-token');
    const savedUser = localStorage.getItem('heritage-user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      console.log('Attempting login with API URL:', API_BASE_URL);
      
      const response = await axios.post('/auth/login', {
        username,
        password
      });

      console.log('Login response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      // Store in state
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('heritage-token', newToken);
      localStorage.setItem('heritage-user', JSON.stringify(userData));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log('Login successful for user:', userData.name);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Clear any partial state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('heritage-token');
      localStorage.removeItem('heritage-user');
      
      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      
      const response = await axios.put('/auth/updatepassword', {
        currentPassword,
        newPassword
      });

      const { token: newToken } = response.data;
      
      // Update token
      setToken(newToken);
      localStorage.setItem('heritage-token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Password update failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await axios.get('/auth/me');
      const userData = response.data.data;
      
      setUser(userData);
      localStorage.setItem('heritage-user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        await logout();
      }
      throw error;
    }
  };

  // Check if user has specific permission
  const hasPermission = (module, action) => {
    if (!user || !user.permissions) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permission
    const permission = user.permissions.find(p => p.module === module);
    return permission && permission.actions.includes(action);
  };

  // Check if user has access to department
  const hasDepartmentAccess = (department) => {
    if (!user) return false;
    
    // Admin and users with 'all' department access
    if (user.role === 'admin' || user.department === 'all') return true;
    
    return user.department === department;
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updatePassword,
    refreshUserData,
    hasPermission,
    hasDepartmentAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};