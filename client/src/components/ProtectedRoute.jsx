import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role || user.user?.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If logged in user tries accessing an unauthorized role route, send to their own dashboard
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'agent') return <Navigate to="/agent" replace />;
    if (role === 'customer') return <Navigate to="/customer" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
