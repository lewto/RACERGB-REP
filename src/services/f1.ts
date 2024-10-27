import axios from 'axios';
import { F1Response, Race } from '../types/f1';
import { parseISO, isAfter, isBefore, addHours } from 'date-fns';

const ERGAST_URL = 'https://ergast.com/api/f1';
const OPENF1_URL = 'https://api.openf1.org/v1';

const ergastApi = axios.create({
  baseURL: ERGAST_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

const openF1Api = axios.create({
  baseURL: OPENF1_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
});

// Add retry logic for both APIs
[ergastApi, openF1Api].forEach(api => {
  api.interceptors.response.use(
    response => response,
    async error => {
      const maxRetries = 3;
      let retryCount = error.config.retryCount || 0;

      if (error.code === 'ECONNABORTED' && retryCount < maxRetries) {
        error.config.retryCount = retryCount + 1;
        return api.request(error.config);
      }
      return Promise.reject(error);
    }
  );
});

export const getF1Schedule = async (year: number = new Date().getFullYear()): Promise<Race[]> => {
  try {
    const response = await ergastApi.get<F1Response>(`/${year}.json`);
    
    if (!response.data?.MRData?.RaceTable?.Races) {
      throw new Error('Invalid API response format');
    }

    return response.data.MRData.RaceTable.Races;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch F1 schedule: ${error.message}`);
    }
    throw error;
  }
};

export const getCurrentSession = async () => {
  try {
    const response = await openF1Api.get('/session', {
      params: {
        'date_start[lte]': new Date().toISOString(),
        'date_end[gte]': addHours(new Date(), -3).toISOString() // Allow connections up to 3 hours after start
      }
    });

    if (response.data && response.data.length > 0) {
      const session = response.data[0];
      return {
        session_name: session.session_type.toUpperCase(),
        date_start: session.date_start,
        date_end: session.date_end,
        session_type: session.session_type,
        race_name: session.race_name,
        circuit_name: session.circuit_name,
        is_active: true
      };
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.warn('Session API timeout - retrying...');
        return getCurrentSession(); // Retry once
      }
      console.error('Session API error:', error.message);
    } else {
      console.error('Unexpected error getting current session:', error);
    }
    return null;
  }
};

export const getNextSession = async () => {
  try {
    const now = new Date();
    const schedule = await getF1Schedule();
    
    // Process each race to find the next session
    for (const race of schedule) {
      // Create array of all sessions for this race
      const sessions = [
        { type: 'FP1', ...race.FirstPractice },
        { type: 'FP2', ...race.SecondPractice },
        { type: 'FP3', ...race.ThirdPractice },
        { type: 'Sprint Shootout', ...race.SprintShootout },
        { type: 'Sprint', ...race.Sprint },
        { type: 'Qualifying', ...race.Qualifying },
        { type: 'Race', date: race.date, time: race.time }
      ]
      .filter(session => session.date && session.time)
      .map(session => {
        const sessionStart = parseISO(`${session.date}T${session.time}`);
        return {
          ...session,
          sessionStart,
          sessionEnd: addHours(sessionStart, 3) // Allow connections up to 3 hours after start
        };
      })
      .sort((a, b) => a.sessionStart.getTime() - b.sessionStart.getTime());

      // Find the next session that hasn't ended yet
      const nextSession = sessions.find(session => isAfter(session.sessionEnd, now));
      
      if (nextSession) {
        return {
          session_name: nextSession.type,
          date: nextSession.date,
          time: nextSession.time,
          date_start: nextSession.sessionStart.toISOString(),
          date_end: nextSession.sessionEnd.toISOString(),
          session_type: nextSession.type.toLowerCase(),
          race_name: race.raceName,
          circuit_name: race.Circuit.circuitName,
          is_active: isAfter(now, nextSession.sessionStart) && isBefore(now, nextSession.sessionEnd)
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get next session:', error);
    return null;
  }
};

export const isSessionActive = (session: any): boolean => {
  if (!session) return false;

  const now = new Date();
  const sessionStart = parseISO(session.date_start);
  const sessionEnd = parseISO(session.date_end);

  return isAfter(now, sessionStart) && isBefore(now, sessionEnd);
};