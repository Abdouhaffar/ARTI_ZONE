import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // في التطبيق الحقيقي، تحقق من أن المستخدم مشرف
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;
