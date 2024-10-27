import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi } from 'lucide-react';
import { isRaceSessionActive } from '../services/openf1';

const LiveSessionIndicator = () => {
  const [isLive, setIsLive] = useState(false);
  const [nextCheck, setNextCheck] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const active = await isRaceSessionActive();
        setIsLive(active);
        
        // If session is live, check more frequently
        const checkInterval = active ? 10000 : 60000;
        setNextCheck(Date.now() + checkInterval);
        
        interval = setTimeout(checkSession, checkInterval);
      } catch (err) {
        setError('Failed to check session status');
        interval = setTimeout(checkSession, 60000);
      }
    };

    checkSession();
    return () => clearTimeout(interval);
  }, []);

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!isLive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#34C759] text-white px-4 py-3 rounded-lg shadow-lg 
                    animate-pulse-slow flex items-center space-x-3">
      <Wifi className="w-5 h-5" />
      <div>
        <p className="font-medium">Session Live</p>
        <p className="text-sm opacity-90">Syncing with F1 broadcast</p>
      </div>
    </div>
  );
};

export default LiveSessionIndicator;