// src/auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext';

export function PrivateRoute({ allowedRoles }) {
  const { user } = useContext(AuthContext);

  console.log('[PrivateRoute] current user:', user);
  console.log('[PrivateRoute] allowedRoles:', allowedRoles);

  // not logged in → send to login
  if (!user) {
    console.log('[PrivateRoute] no user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // wrong role → send to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(
      `[PrivateRoute] role “${user.role}” not in [${allowedRoles.join(
        ','
      )}], redirecting to /unauthorized`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // you’re good
  return <Outlet />;
}

export default PrivateRoute;
