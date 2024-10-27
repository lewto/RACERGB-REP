import { useState, useEffect, useCallback } from 'react';
import { Race } from '../types/f1';
import { getF1Schedule, getCurrentSession, getNextSession as getNextF1Session } from '../services/f1';
import { format, parseISO, isAfter, isBefore, addMinutes } from 'date-fns';

export const useF1Schedule = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await getF1Schedule();
        setRaces(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load F1 schedule');
        console.error('Error fetching F1 schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const getCurrentRace = useCallback(() => {
    if (!races.length) return null;
    
    const now = new Date();
    return races.find(race => {
      const raceStart = parseISO(`${race.date}T${race.time}`);
      const weekendStart = parseISO(`${race.FirstPractice?.date}T${race.FirstPractice?.time}`);
      const weekendEnd = addMinutes(raceStart, 180); // Race + 3 hours buffer
      
      return isAfter(now, weekendStart) && isBefore(now, weekendEnd);
    });
  }, [races]);

  const getCurrentSession = useCallback(async () => {
    try {
      return await getCurrentSession();
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }, []);

  const getNextSession = useCallback(async () => {
    try {
      return await getNextF1Session();
    } catch (error) {
      console.error('Error getting next session:', error);
      return null;
    }
  }, []);

  const getNextRace = useCallback(() => {
    if (!races.length) return null;
    
    const now = new Date();
    return races.find(race => {
      const raceDate = parseISO(`${race.date}T${race.time}`);
      return isAfter(raceDate, now);
    });
  }, [races]);

  const isSessionActive = useCallback((race: Race) => {
    const now = new Date();
    const sessions = [
      { name: 'FP1', ...race.FirstPractice },
      { name: 'FP2', ...race.SecondPractice },
      { name: 'FP3', ...race.ThirdPractice },
      { name: 'Sprint Shootout', ...race.SprintShootout },
      { name: 'Sprint', ...race.Sprint },
      { name: 'Qualifying', ...race.Qualifying },
      { name: 'Race', date: race.date, time: race.time }
    ].filter(session => session.date && session.time);

    return sessions.some(session => {
      const sessionStart = parseISO(`${session.date}T${session.time}`);
      const sessionEnd = addMinutes(sessionStart, 120); // 2-hour session window
      return isAfter(now, sessionStart) && isBefore(now, sessionEnd);
    });
  }, []);

  const formatRaceDateTime = (date: string, time: string) => {
    const dateTime = parseISO(`${date}T${time}`);
    return format(dateTime, 'MMM d, yyyy - h:mm a');
  };

  return {
    races,
    loading,
    error,
    getCurrentRace,
    getCurrentSession,
    getNextRace,
    getNextSession,
    isSessionActive,
    formatRaceDateTime
  };
};

export default useF1Schedule;