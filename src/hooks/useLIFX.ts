import { useState, useEffect, useCallback } from 'react';
import { lifxService } from '../services/lifx';
import { LIFXDevice } from '../types/lifx';
import { useAuth } from '../contexts/AuthContext';

export const useLIFX = () => {
  const { user, updateUserData } = useAuth();
  const [devices, setDevices] = useState<LIFXDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(() => {
    const savedDevices = localStorage.getItem('selected_devices');
    return new Set(savedDevices ? JSON.parse(savedDevices) : []);
  });

  const fetchDevices = useCallback(async () => {
    if (!lifxService.getToken()) {
      setLoading(false);
      setIsConnected(false);
      return;
    }

    try {
      const fetchedDevices = await lifxService.getLights();
      setDevices(fetchedDevices);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to LIFX';
      setError(errorMessage);
      setIsConnected(false);
      setDevices([]);
      
      if (errorMessage.includes('Invalid LIFX API token')) {
        lifxService.disconnect();
        if (updateUserData) {
          await updateUserData({ lifxToken: null });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [updateUserData]);

  const initialize = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      lifxService.setToken(token);
      if (updateUserData) {
        await updateUserData({ lifxToken: token });
      }
      await fetchDevices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize LIFX connection';
      setError(errorMessage);
      setIsConnected(false);
      
      if (errorMessage.includes('Invalid LIFX API token')) {
        lifxService.disconnect();
        if (updateUserData) {
          await updateUserData({ lifxToken: null });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [fetchDevices, updateUserData]);

  const toggleDevice = useCallback(async (deviceId: string) => {
    const newSelectedDevices = new Set(selectedDevices);
    if (newSelectedDevices.has(deviceId)) {
      newSelectedDevices.delete(deviceId);
    } else {
      newSelectedDevices.add(deviceId);
    }
    setSelectedDevices(newSelectedDevices);
    localStorage.setItem('selected_devices', JSON.stringify(Array.from(newSelectedDevices)));
  }, [selectedDevices]);

  const setFlag = useCallback(async (flagType: 'green' | 'yellow' | 'red' | 'safety' | 'checkered', isInitial: boolean = false) => {
    if (!isConnected || selectedDevices.size === 0) return;

    const selector = Array.from(selectedDevices).join(',');
    setError(null);

    try {
      switch (flagType) {
        case 'green':
          await lifxService.setGreenFlag(selector, isInitial);
          break;
        case 'red':
          await lifxService.setRedFlag(selector);
          break;
        case 'safety':
          await lifxService.setSafetyCarFlag(selector);
          break;
        case 'checkered':
          await lifxService.setCheckeredFlag(selector);
          break;
        default:
          await lifxService.setState(selector, {
            power: 'on',
            color: getFlagColor(flagType),
            brightness: 1,
            duration: 0.1
          });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set flag';
      setError(errorMessage);
      
      if (errorMessage.includes('Invalid LIFX API token')) {
        lifxService.disconnect();
        if (updateUserData) {
          await updateUserData({ lifxToken: null });
        }
        setIsConnected(false);
      }
    }
  }, [isConnected, selectedDevices, updateUserData]);

  const disconnect = useCallback(async () => {
    lifxService.disconnect();
    if (updateUserData) {
      await updateUserData({ lifxToken: null });
    }
    setIsConnected(false);
    setDevices([]);
    setSelectedDevices(new Set());
    setError(null);
  }, [updateUserData]);

  useEffect(() => {
    const token = lifxService.getToken();
    if (token && !isConnected && !loading) {
      initialize(token);
    }
  }, [initialize, isConnected, loading]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isConnected && !loading) {
      interval = setInterval(fetchDevices, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected, fetchDevices, loading]);

  return {
    devices,
    loading,
    error,
    isConnected,
    initialize,
    setFlag,
    selectedDevices,
    toggleDevice,
    disconnect
  };
};

const getFlagColor = (flagType: string) => {
  switch (flagType) {
    case 'green':
      return { hue: 120, saturation: 1, kelvin: 3500 };
    case 'yellow':
      return { hue: 60, saturation: 1, kelvin: 3500 };
    case 'red':
      return { hue: 0, saturation: 1, kelvin: 3500 };
    case 'safety':
      return { hue: 60, saturation: 1, kelvin: 3500 };
    case 'checkered':
      return { hue: 0, saturation: 0, kelvin: 3500 };
    default:
      return { hue: 0, saturation: 0, kelvin: 3500 };
  }
};

export default useLIFX;