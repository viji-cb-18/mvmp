import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!token || !user) return <Navigate to="/login" />;
  
    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
      return <Navigate to="/" />;
    }
  
    return children;
  };
  
  export default ProtectedRoute;
