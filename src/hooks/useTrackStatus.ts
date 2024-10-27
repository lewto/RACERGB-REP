import { useState, useEffect, useCallback } from 'react';
import { openF1API } from '../services/api/openf1';
import { useLIFX } from './useLIFX';
import { delayService } from '../services/delayService';

export const useTrackStatus = () => {
  const { setFlag, isConnected, selectedDevices } = useLIFX();
  const [status, setStatus] = useState<string>('green');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFlag, setPendingFlag] = useState<string | null>(null);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  const updateFlag = useCallback(async (newStatus: string) => {
    if (!isConnected || selectedDevices.size === 0) return;

    delayService.queueAction('flag', async () => {
      try {
        await setFlag(newStatus as any);
        setPendingFlag(null);
      } catch (err) {
        console.error('Failed to set flag:', err);
        setError('Failed to update lights');
      }
    });

    setPendingFlag(newStatus);
  }, [isConnected, selectedDevices, setFlag]);

  const fetchStatus = useCallback(async () => {
    try {
      const newStatus = await openF1API.getCurrentFlag();
      
      if (newStatus !== status) {
        console.log(`[Track Status] Flag change detected: ${status} -> ${newStatus}`);
        setStatus(newStatus);
        setLastUpdate(new Date());
        await updateFlag(newStatus);
      }

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch track status';
      setError(errorMessage);
      console.error('[Track Status] Error:', errorMessage);
    }
  }, [status, updateFlag]);

  useEffect(() => {
    const checkAndStartPolling = async () => {
      const active = await openF1API.isSessionActive();
      setIsLive(active);
      if (active) {
        await fetchStatus();
      }
    };

    checkAndStartPolling();
    const sessionInterval = setInterval(checkAndStartPolling, 60000);

    return () => {
      clearInterval(sessionInterval);
    };
  }, [fetchStatus]);

  useEffect(() => {
    let statusInterval: NodeJS.Timeout | null = null;

    if (isLive) {
      console.log('[Track Status] Starting live polling');
      statusInterval = setInterval(fetchStatus, 500);
    }

    return () => {
      if (statusInterval) {
        console.log('[Track Status] Stopping live polling');
        clearInterval(statusInterval);
      }
    };
  }, [isLive, fetchStatus]);

  return {
    status,
    lastUpdate,
    isLive,
    error,
    pendingFlag,
    updateFlag
  };
};

export default useTrackStatus;