
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Check the actual session validity, not just token existence.
import { isAdminSessionValid } from '../utils/adminSession';

const ProtectedRoute = () => {
  const isAuthenticated = isAdminSessionValid();

  // If the session is missing or expired,
  // redirect the admin to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow access to the admin dashboard.
  return <Outlet />;
};

export default ProtectedRoute;
