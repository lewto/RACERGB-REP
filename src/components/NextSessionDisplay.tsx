import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { parseISO, formatDistanceToNow } from 'date-fns';

interface NextSessionDisplayProps {
  session: {
    session_name?: string;
    date?: string;
    time?: string;
  } | null;
  canConnect: boolean;
  isCurrentSession?: boolean;
}

const NextSessionDisplay: React.FC<NextSessionDisplayProps> = ({ 
  session, 
  canConnect,
  isCurrentSession 
}) => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      if (!session?.date || !session?.time) {
        setCountdown('No upcoming sessions');
        return;
      }

      try {
        if (isCurrentSession) {
          setCountdown('Session in progress');
          return;
        }

        const sessionDate = parseISO(`${session.date}T${session.time}`);
        const timeUntil = formatDistanceToNow(sessionDate, { addSuffix: true });
        setCountdown(`${session.session_name} starts ${timeUntil}`);
      } catch (error) {
        console.error('Error updating countdown:', error);
        setCountdown('Unable to calculate countdown');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session, isCurrentSession]);

  if (!session) {
    return (
      <div className="bg-[#151A2D] rounded-lg p-4 border border-[#1E2642]">
        <div className="flex items-center justify-center text-gray-400">
          <span>No upcoming sessions scheduled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151A2D] rounded-lg p-4 border border-[#1E2642]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Timer className="w-5 h-5 text-race-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-white">
              {session.session_name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {countdown}
            </p>
          </div>
        </div>
        {canConnect && (
          <span className="text-xs text-[#34C759] bg-[#34C759]/10 px-3 py-1 rounded-full">
            {isCurrentSession ? 'Session Active' : 'Ready to Connect'}
          </span>
        )}
      </div>
    </div>
  );
};

export default NextSessionDisplay;