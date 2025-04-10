/*import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token || !user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
*/ 
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    // 🚫 If no token or user, redirect to login
    if (!token || !user) return <Navigate to="/login" />;
  
    // ✅ Check if role is allowed only if user exists
    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
      return <Navigate to="/" />; // or show unauthorized page
    }
  
    return children;
  };
  
  export default ProtectedRoute;
