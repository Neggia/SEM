import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (!user.isLoggedIn) {
    // Redirect to login page, preserving the current location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // User does not have required role, redirect to home page
    return <Navigate to="/unauth" replace />;
  }

  // User is authenticated and has required role, render children
  return children;
};

export default PrivateRoute;
