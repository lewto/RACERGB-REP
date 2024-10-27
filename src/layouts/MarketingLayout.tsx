import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Flag } from 'lucide-react';

const MarketingLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      <nav className="bg-[#151A2D]/95 backdrop-blur-md border-b border-[#1E2642]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Flag className="h-6 w-6 text-white" />
              <span className="text-xl font-semibold text-white">
                RACE RGB
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/login" 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/login"
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default MarketingLayout;