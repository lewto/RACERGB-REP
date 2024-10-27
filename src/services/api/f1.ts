import { API_CONFIG, createProxyUrl } from './config';
import type { F1Response, Race } from '../../types/f1';
import axios from 'axios';
import { parseISO, isAfter, isBefore, addHours } from 'date-fns';

const api = axios.create({
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

export const getF1Schedule = async (year: number = new Date().getFullYear()): Promise<Race[]> => {
  try {
    const url = createProxyUrl(`${API_CONFIG.OPENF1_URL}/sessions?year=${year}`);
    const response = await api.get(url);
    
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid API response format');
    }

    // Transform OpenF1 session data to match our Race type
    const races = response.data.reduce((acc: Race[], session: any) => {
      const existingRace = acc.find(r => r.raceName === session.meeting_name);
      
      if (existingRace) {
        // Add session to existing race
        switch (session.session_type) {
          case 'Practice 1':
            existingRace.FirstPractice = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Practice 2':
            existingRace.SecondPractice = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Practice 3':
            existingRace.ThirdPractice = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Sprint Shootout':
            existingRace.SprintShootout = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Sprint':
            existingRace.Sprint = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Qualifying':
            existingRace.Qualifying = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Race':
            existingRace.date = session.date_start.split('T')[0];
            existingRace.time = session.date_start.split('T')[1];
            break;
        }
      } else {
        // Create new race entry
        const race: Race = {
          season: year.toString(),
          round: session.round?.toString() || '0',
          raceName: session.meeting_name,
          Circuit: {
            circuitId: session.circuit_key?.toString() || '0',
            url: '',
            circuitName: session.circuit_name,
            Location: {
              lat: '0',
              long: '0',
              locality: session.location || '',
              country: session.country || ''
            }
          },
          date: session.date_start.split('T')[0],
          time: session.date_start.split('T')[1]
        };

        // Add initial session
        switch (session.session_type) {
          case 'Practice 1':
            race.FirstPractice = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Practice 2':
            race.SecondPractice = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Practice 3':
            race.ThirdPractice = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Sprint Shootout':
            race.SprintShootout = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Sprint':
            race.Sprint = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
          case 'Qualifying':
            race.Qualifying = { date: session.date_start.split('T')[0], time: session.date_start.split('T')[1] };
            break;
        }

        acc.push(race);
      }
      
      return acc;
    }, []);

    return races.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  } catch (error) {
    console.error('Failed to fetch F1 schedule:', error);
    throw error;
  }
};

export const getCurrentSession = async () => {
  try {
    const url = createProxyUrl(`${API_CONFIG.OPENF1_URL}/session?status=active`);
    const response = await api.get(url);

    if (response.data && response.data.length > 0) {
      const session = response.data[0];
      return {
        session_name: session.session_type.toUpperCase(),
        date_start: session.date_start,
        date_end: session.date_end,
        session_type: session.session_type,
        race_name: session.meeting_name,
        circuit_name: session.circuit_name,
        is_active: true
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to get current session:', error);
    return null;
  }
};

export const getNextSession = async () => {
  try {
    const url = createProxyUrl(`${API_CONFIG.OPENF1_URL}/session?status=upcoming&limit=1`);
    const response = await api.get(url);

    if (response.data && response.data.length > 0) {
      const session = response.data[0];
      return {
        session_name: session.session_type.toUpperCase(),
        date: session.date_start.split('T')[0],
        time: session.date_start.split('T')[1],
        date_start: session.date_start,
        date_end: session.date_end,
        session_type: session.session_type,
        race_name: session.meeting_name,
        circuit_name: session.circuit_name,
        is_active: false
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to get next session:', error);
    return null;
  }
};

export const isSessionActive = async (): Promise<boolean> => {
  try {
    const session = await getCurrentSession();
    return session?.is_active || false;
  } catch (error) {
    console.error('Failed to check session status:', error);
    return false;
  }
};