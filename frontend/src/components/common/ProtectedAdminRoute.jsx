import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { token, loading } = useAdminAuth();
  if (loading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/admin/login" />;
};

export default ProtectedAdminRoute;