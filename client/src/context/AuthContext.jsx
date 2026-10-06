import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ewaste_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ewaste_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ewaste_user');
    }
  }, [user]);

  const login = async (username, password, role) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { username, password, role });
      setUser(res.data);
      setLoading(false);
      return { success: true, user: res.data };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const signup = async (customerData) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', customerData);
      // Store same shape as login: { token, user, message }
      setUser(res.data);
      setLoading(false);
      return { success: true, message: res.data.message };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ewaste_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
