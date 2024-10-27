import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Calendar, Wifi, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import GlowCursor from '../components/GlowCursor';

const ListItem = ({ children, icon }: { children: React.ReactNode, icon?: React.ReactNode }) => (
  <li className="flex items-center text-gray-300">
    {icon || <Zap className="h-5 w-5 text-[#34C759] mr-2 flex-shrink-0" />}
    {children}
  </li>
);

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] relative overflow-hidden">
      <GlowCursor />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl animate-pulse-slow delay-75" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative">
          <div className="text-center max-w-3xl mx-auto fade-in">
            <div className="flex justify-center mb-12">
              <Logo />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.2] mb-8">
              <span className="block pb-4">Sync Your Space with</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 animate-gradient leading-[1.3]">
                F1 Race Flags
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Transform your room into a dynamic F1 experience. Race RGB connects your LIFX smart lights
              to live F1 race broadcasts, bringing the track atmosphere home.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/login"
                className="group inline-flex items-center px-8 py-3 border border-transparent text-base 
                         font-medium rounded-lg text-black bg-white hover:bg-neutral-100 
                         transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-white/10 text-base 
                         font-medium rounded-lg text-white hover:bg-white/5 
                         transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 bg-[#0D1119]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <div className="text-[#34C759]">🏁</div>,
                title: "Real-Time Flag Sync",
                description: "Instant synchronization with live F1 race flags through the OpenF1 API"
              },
              {
                icon: <div className="text-[#007AFF]">💡</div>,
                title: "LIFX Integration",
                description: "Seamless connection with your LIFX smart lights for immersive racing"
              },
              {
                icon: <div className="text-[#FF3B30]">📅</div>,
                title: "Race Schedule",
                description: "Never miss a session with our integrated F1 calendar and notifications"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group fade-in" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="flex justify-center mb-4 transform transition-transform group-hover:scale-110 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="py-24 bg-[#151A2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Start with a free race weekend, then unlock lifetime access.</p>
          </div>

          <div className="max-w-lg mx-auto bg-[#1A1F35] rounded-xl overflow-hidden fade-in">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-white mb-4">Lifetime Access</h3>
              <p className="text-4xl font-bold text-white mb-6">
                $7 <span className="text-lg text-gray-400">USD</span>
              </p>
              
              {/* Core Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Core Features</h4>
                <ul className="space-y-3">
                  <ListItem>Unlimited race weekends</ListItem>
                  <ListItem>Real-time flag synchronization</ListItem>
                  <ListItem>Full LIFX integration</ListItem>
                  <ListItem>Race calendar access</ListItem>
                </ul>
              </div>

              {/* Advanced Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Advanced Features</h4>
                <ul className="space-y-3">
                  <ListItem>Live F1 session data</ListItem>
                  <ListItem>Broadcast delay synchronization</ListItem>
                  <ListItem>Custom light effects for each flag type</ListItem>
                  <ListItem>Multiple room configuration</ListItem>
                </ul>
              </div>

              {/* Coming Soon */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">Coming Soon</h4>
                <ul className="space-y-3">
                  <ListItem icon={<Lock className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />}>
                    Philips Hue integration
                  </ListItem>
                  <ListItem icon={<Lock className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />}>
                    Nanoleaf integration
                  </ListItem>
                  <ListItem icon={<Lock className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />}>
                    Custom animation editor
                  </ListItem>
                </ul>
              </div>

              <Link
                to="/login"
                className="block w-full bg-white text-black text-center px-6 py-3 rounded-lg 
                         hover:bg-neutral-100 transition-colors font-medium cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with OpenF1 Attribution */}
      <div className="bg-[#0D1119] py-8 border-t border-[#1E2642]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-400 text-sm">
              Powered by{' '}
              <a 
                href="https://openf1.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-race-blue-500 hover:text-race-blue-400 transition-colors font-medium"
              >
                OpenF1 API
              </a>
            </p>
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Race RGB. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;