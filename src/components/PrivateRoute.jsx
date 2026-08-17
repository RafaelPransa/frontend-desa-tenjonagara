import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getMe } from '../services/desaService';

export default function PrivateRoute({ children }) {
  const [authState, setAuthState] = useState('checking'); // 'checking' | 'valid' | 'invalid'
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthState('invalid');
      return;
    }

    // Verifikasi validitas token langsung ke endpoint server
    getMe()
      .then((res) => {
        if (res && (res.success || res.data)) {
          setAuthState('valid');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState('invalid');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState('invalid');
      });
  }, []);

  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-600">Memverifikasi sesi administrator...</p>
      </div>
    );
  }

  if (authState === 'invalid') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
