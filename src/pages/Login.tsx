import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useF1Schedule } from '../hooks/useF1Schedule';
import PayPalButton from '../components/PayPalButton';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'lifetime'>('trial');
  const [showPayPal, setShowPayPal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextRace } = useF1Schedule();
  const nextRace = getNextRace();

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, selectedPlan);
        if (selectedPlan === 'trial') {
          navigate('/dashboard');
        } else {
          setShowPayPal(true);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'PAYMENT_REQUIRED') {
          setShowPayPal(true);
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Authentication failed:', err);
    }
  };

  if (showPayPal) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0B0F1A] py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <PayPalButton email={email} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0B0F1A] py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="bg-[#151A2D] rounded-xl p-8 border border-[#1E2642]">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-700 bg-[#0D1119] text-white shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-700 bg-[#0D1119] text-white shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {!isLogin && (
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-300">Select your plan</div>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('trial')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedPlan === 'trial'
                        ? 'bg-[#1A1F35] border-blue-500'
                        : 'border-[#1E2642] hover:border-[#2A365D]'
                    }`}
                  >
                    <div className="text-white font-medium">Free Trial</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Access for one race weekend ({nextRace?.raceName})
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('lifetime')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedPlan === 'lifetime'
                        ? 'bg-[#1A1F35] border-blue-500'
                        : 'border-[#1E2642] hover:border-[#2A365D]'
                    }`}
                  >
                    <div className="text-white font-medium">Lifetime Access</div>
                    <div className="text-sm text-gray-400 mt-1">
                      $7 USD - Unlimited access to all features
                    </div>
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-500 hover:text-blue-400">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm 
                       text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : selectedPlan === 'trial' ? 'Start Free Trial' : 'Continue to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;