import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

export function RequireAuth() {
  const { role } = useAuth();
  const location = useLocation();

  if (!role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function LoginRoute() {
  const { role } = useAuth();

  if (role === 'employer') return <Navigate to="/" replace />;
  if (role === 'employee') return <Navigate to="/jobs" replace />;

  return <LoginPage />;
}

export function EmployerOnly({ children }) {
  const { isEmployer } = useAuth();

  if (!isEmployer) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
}

export function EmployeeOnly({ children }) {
  const { isEmployee } = useAuth();

  if (!isEmployee) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
}
