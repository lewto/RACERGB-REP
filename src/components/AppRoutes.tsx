import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Help from '../pages/Help';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      {(isAuthenticated || window.location.pathname !== '/') && <Navbar />}
      
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
        } />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
          isAuthenticated ? <Settings /> : <Navigate to="/login" />
        } />
        <Route path="/help" element={<Help />} />
        {isAdmin && (
          <Route path="/admin" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          } />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;