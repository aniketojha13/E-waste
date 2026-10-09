import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ewaste_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Migrate old nested format { message, token, user: { ... } } if present
      let flat;
      if (parsed && parsed.user && typeof parsed.user === 'object') {
        flat = {
          ...parsed.user,
          token: parsed.token || parsed.user.token
        };
      } else {
        flat = parsed;
      }
      // Validate token expiry client-side (JWT payload is base64 encoded)
      if (flat?.token) {
        try {
          const payloadB64 = flat.token.split('.')[1];
          const payload = JSON.parse(atob(payloadB64));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            // Token is expired — clear it
            localStorage.removeItem('ewaste_user');
            return null;
          }
          // Ensure role is present in the stored user
          if (payload.role && !flat.role) {
            flat.role = payload.role;
          }
        } catch {
          // If we can't parse the JWT, clear the session
          localStorage.removeItem('ewaste_user');
          return null;
        }
      }
      return flat;
    } catch {
      return null;
    }
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
      // Flatten response so user.role, user.name, user.username and user.token are all top-level
      const userData = {
        ...(res.data.user || {}),
        token: res.data.token
      };
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
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
      const userData = {
        ...(res.data.user || {}),
        token: res.data.token
      };
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData, message: res.data.message };
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
