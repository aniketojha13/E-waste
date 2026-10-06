import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (authToken, userData) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
