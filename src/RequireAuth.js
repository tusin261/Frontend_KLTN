import React, { useContext } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../src/context/hooks";

export default function RequireAuth({ children }) {
  const { user } = useAuth();
  let navigate = useNavigate();
  console.log('require auth');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
