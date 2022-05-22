import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../src/context/hooks";

export default function RedirectHandler() {
  const { user } = useAuth();
  let navigate = useNavigate();
  useEffect(() => {
    if (user.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/chat');
    }
  }, [user]);

  return (
    <div>
    </div>
  );
}
