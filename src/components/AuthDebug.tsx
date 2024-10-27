import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { isAuthenticated, login, logout } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  const handleToggle = async () => {
    try {
      if (isAuthenticated) {
        logout();
      } else {
        await login('test@example.com', 'password');
      }
    } catch (error) {
      console.error('Auth toggle failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 hover:bg-gray-700"
      >
        Preview as: {isAuthenticated ? 'Signed Out' : 'Signed In'}
      </button>
    </div>
  );
};

export default AuthDebug;