import React from 'react';
import { Flag } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-3 select-none">
      <div className="relative">
        <Flag className="h-8 w-8 text-white relative z-10" />
        <div className="absolute inset-0 animate-pulse-slow mix-blend-overlay bg-gradient-to-r from-[#FF3B30] via-[#34C759] to-[#007AFF] rounded-full blur-lg opacity-50" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          RACE
        </span>
        <div className="flex items-center -mt-1">
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF3B30] via-[#34C759] to-[#007AFF] animate-gradient">
            RGB
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Logo;