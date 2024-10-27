import React, { useState, useEffect } from 'react';
import { parseISO, formatDistanceToNow, differenceInMinutes } from 'date-fns';

interface SessionCountdownProps {
  date_start: string;
}

const SessionCountdown: React.FC<SessionCountdownProps> = ({ date_start }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      try {
        const now = new Date();
        const start = parseISO(date_start);
        const minutesLeft = differenceInMinutes(start, now);
        
        if (minutesLeft <= 0) {
          setTimeLeft('Starting now');
        } else if (minutesLeft < 60) {
          setTimeLeft(`${minutesLeft} minutes`);
        } else {
          setTimeLeft(formatDistanceToNow(start, { addSuffix: true }));
        }
      } catch (error) {
        console.error('Error updating countdown:', error);
        setTimeLeft('Invalid date');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [date_start]);

  return (
    <p className="text-xs text-race-blue-500 mt-1">
      Starts {timeLeft}
    </p>
  );
};

export default SessionCountdown;