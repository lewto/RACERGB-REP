import React, { useState, useEffect, useCallback } from 'react';
import { Flag, AlertTriangle, Car, Square, Radio, Wifi, Clock, PlayCircle, Settings } from 'lucide-react';
import { parseISO, formatDistanceToNow, addMinutes } from 'date-fns';
import { useLIFX } from '../hooks/useLIFX';
import { useTrackStatus } from '../hooks/useTrackStatus';
import { useF1Schedule } from '../hooks/useF1Schedule';
import { delayService } from '../services/delayService';
import { cn } from '../lib/utils';
import TestApiControls from './TestApiControls';
import NextSessionDisplay from './NextSessionDisplay';
import CollapsibleSection from './CollapsibleSection';
import { Link } from 'react-router-dom';

interface FlagIconProps {
  icon: React.ElementType;
  color: string;
  isActive: boolean;
}

const FlagIcon: React.FC<FlagIconProps> = ({ icon: Icon, color, isActive }) => (
  <div className="relative">
    <Icon className={cn(
      "w-8 h-8 transition-all duration-200",
      isActive ? "scale-110" : "scale-100",
      color
    )} />
    {isActive && (
      <>
        <div className={cn(
          "absolute inset-0 rounded-full blur-sm -z-10 opacity-75",
          color.replace('text-', 'bg-')
        )} />
        <div className={cn(
          "absolute inset-0 rounded-full blur-lg -z-20 opacity-50",
          color.replace('text-', 'bg-')
        )} />
      </>
    )}
  </div>
);

const RaceControl: React.FC = () => {
  const { setFlag, error: lifxError, selectedDevices, isConnected: lifxConnected } = useLIFX();
  const { status, isLive, error: apiError, lastUpdate, pendingFlag } = useTrackStatus();
  const { getNextSession } = useF1Schedule();
  const [autoMode, setAutoMode] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showTestControls] = useState(process.env.NODE_ENV === 'development');
  const [activeFlag, setActiveFlag] = useState<string>('green');
  const [nextSession, setNextSession] = useState<any>(null);
  const [showAutoModePrompt, setShowAutoModePrompt] = useState(false);

  useEffect(() => {
    const updateNextSession = async () => {
      const session = await getNextSession();
      setNextSession(session);
    };

    updateNextSession();
    const interval = setInterval(updateNextSession, 60000);
    return () => clearInterval(interval);
  }, [getNextSession]);

  const canConnect = nextSession?.date ? 
    new Date() >= addMinutes(parseISO(`${nextSession.date}T${nextSession.time}`), -5) : false;

  const handleConnect = async () => {
    if (!lifxConnected || selectedDevices.size === 0) return;
    setIsConnected(true);
    setShowAutoModePrompt(true);
    setAutoMode(true);
    
    try {
      await setFlag('green', true);
    } catch (error) {
      console.error('Failed to set initial flag:', error);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAutoMode(false);
    setActiveFlag('green');
    setShowAutoModePrompt(false);
  };

  const handleFlagClick = async (flag: string) => {
    if (autoMode && isConnected) return;
    
    setActiveFlag(flag);
    if (selectedDevices.size > 0) {
      try {
        await setFlag(flag as any);
      } catch (error) {
        console.error('Failed to set flag:', error);
      }
    }
  };

  const showConnectionRequirements = !lifxConnected || selectedDevices.size === 0;

  return (
    <div className="space-y-6">
      {/* Connection Requirements Warning */}
      {showConnectionRequirements && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-white">Connection Requirements</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-400">
                {!lifxConnected && (
                  <li className="flex items-center space-x-2">
                    <span>•</span>
                    <span>Connect your LIFX account in</span>
                    <Link to="/settings" className="text-race-blue-500 hover:text-race-blue-400 transition-colors">
                      Settings
                    </Link>
                  </li>
                )}
                {selectedDevices.size === 0 && (
                  <li>• Select at least one light to control</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Auto Mode Prompt */}
      {showAutoModePrompt && (
        <CollapsibleSection
          title="Auto Mode"
          icon={<PlayCircle className="w-5 h-5 text-race-blue-500" />}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Your lights will automatically sync with live race flags. Toggle auto mode off for manual control.
            </p>
            <div className="flex items-center justify-between bg-[#1A1F35] p-4 rounded-lg">
              <span className="text-white">Auto Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoMode}
                  onChange={(e) => setAutoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                            after:start-[2px] after:bg-white after:border-gray-300 after:border 
                            after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-race-blue-500">
                </div>
              </label>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Next Session Display */}
      <NextSessionDisplay 
        session={nextSession} 
        canConnect={canConnect} 
      />

      {/* Connect/Disconnect Button */}
      <button
        className={cn(
          "w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200",
          isConnected
            ? "bg-[#34C759] hover:bg-[#2FB350] text-white cursor-pointer"
            : (canConnect && !showConnectionRequirements)
            ? "bg-race-blue-500 hover:bg-race-blue-600 text-white cursor-pointer"
            : "bg-[#151A2D] text-gray-400 cursor-not-allowed"
        )}
        disabled={!canConnect || showConnectionRequirements}
        onClick={isConnected ? handleDisconnect : handleConnect}
      >
        {isConnected ? (
          <>
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="font-medium">Connected to {nextSession?.session_name || 'Session'}</span>
          </>
        ) : (
          <>
            <Wifi className="w-5 h-5" />
            <span className="font-medium">
              {canConnect 
                ? `Connect to ${nextSession?.session_name || 'Session'}` 
                : nextSession?.date
                ? `${nextSession.session_name} starts ${formatDistanceToNow(parseISO(`${nextSession.date}T${nextSession.time}`), { addSuffix: true })}`
                : 'No Upcoming Sessions'}
            </span>
          </>
        )}
      </button>

      {/* Flag Controls */}
      <CollapsibleSection
        title="Flag Controls"
        icon={<Flag className="w-5 h-5" />}
        defaultExpanded={true}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { type: 'green', icon: Flag, color: 'text-[#34C759]', label: 'Green Flag', description: 'Track is clear' },
              { type: 'yellow', icon: AlertTriangle, color: 'text-yellow-500', label: 'Yellow Flag', description: 'Hazard ahead' },
              { type: 'red', icon: AlertTriangle, color: 'text-[#FF3B30]', label: 'Red Flag', description: 'Session stopped' },
              { type: 'safety', icon: Car, color: 'text-orange-500', label: 'Safety Car', description: 'Safety car deployed' },
              { type: 'checkered', icon: Square, color: 'text-white', label: 'Checkered Flag', description: 'Session complete' }
            ].map((flag) => (
              <button
                key={flag.type}
                onClick={() => handleFlagClick(flag.type)}
                disabled={autoMode && isConnected}
                className={cn(
                  'relative flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200',
                  activeFlag === flag.type
                    ? 'bg-[#1A1F35] ring-2 ring-white/20 shadow-lg shadow-white/5'
                    : 'bg-[#151A2D] hover:bg-[#1A1F35] hover:shadow-lg hover:shadow-white/5',
                  'cursor-pointer border border-[#1E2642]',
                  autoMode && isConnected ? 'opacity-50 cursor-not-allowed' : ''
                )}
              >
                <FlagIcon
                  icon={flag.icon}
                  color={flag.color}
                  isActive={activeFlag === flag.type}
                />
                <span className="text-white font-medium mt-2">{flag.label}</span>
                <span className="text-gray-400 text-sm">{flag.description}</span>
              </button>
            ))}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between bg-[#151A2D] rounded-lg p-4 border border-[#1E2642]">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Current Flag:</span>
              <span className="text-white font-medium">{activeFlag.toUpperCase()}</span>
            </div>
            {lastUpdate && (
              <div className="text-sm text-gray-400">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Errors */}
          {(lifxError || apiError) && (
            <div className="mt-4 text-red-500 text-sm bg-red-500/10 rounded-lg p-4">
              {lifxError || apiError}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Test Controls */}
      {showTestControls && (
        <CollapsibleSection
          title="Test Controls"
          icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}
          defaultExpanded={false}
        >
          <TestApiControls />
        </CollapsibleSection>
      )}
    </div>
  );
};

export default RaceControl;