import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="bg-[#151A2D]/95 backdrop-blur-md border-b border-[#1E2642]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            to={isAuthenticated ? '/dashboard' : '/'} 
            className="transform hover:scale-105 transition-transform"
          >
            <Logo />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm ${
                    location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className={`text-sm ${
                    location.pathname === '/settings' ? 'text-white' : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Settings
                </Link>
                <Link 
                  to="/help" 
                  className={`text-sm ${
                    location.pathname === '/help' ? 'text-white' : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Help
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`text-sm flex items-center space-x-2 ${
                      location.pathname === '/admin' ? 'text-white' : 'text-gray-400 hover:text-white'
                    } transition-colors`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            ) : (
              location.pathname !== '/' && (
                <>
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
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;