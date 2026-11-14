import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route so only users with role === 'admin' can see it.
 * Non-logged-in users → /login
 * Logged-in non-admins → / (home)
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for auth to hydrate from localStorage

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
