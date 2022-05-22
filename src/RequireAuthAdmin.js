import React, { useContext } from 'react';
import { useAuth } from "../src/context/hooks";
import { useNavigate, Navigate, useLocation } from 'react-router-dom';

export default function RequireAuthAdmin({ children }) {
  const { user } = useAuth();
  let navigate = useNavigate();
  console.log('require admin')
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
