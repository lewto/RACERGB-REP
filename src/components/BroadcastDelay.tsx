import React, { useState, useEffect } from 'react';
import { Tv, Globe, Video, AlertTriangle, Info, Timer } from 'lucide-react';
import { useLIFX } from '../hooks/useLIFX';
import { delayService } from '../services/delayService';
import { cn } from '../lib/utils';
import BroadcastDelayCalibrator from './BroadcastDelayCalibrator';

interface DelayOptionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
  isSelected: boolean;
  onClick: () => void;
}

const DelayOption: React.FC<DelayOptionProps> = ({
  icon: Icon,
  title,
  description,
  isSelected,
  onClick
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 w-full text-left',
      isSelected 
        ? 'bg-[#1A1F35] border-race-blue-500 ring-1 ring-race-blue-500/50' 
        : 'border-[#1E2642] hover:border-[#2A365D] hover:bg-[#1A1F35]/50'
    )}
  >
    <Icon className={cn(
      'w-5 h-5 mt-0.5',
      isSelected ? 'text-race-blue-500' : 'text-gray-400'
    )} />
    <div>
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  </button>
);

const BroadcastDelay: React.FC = () => {
  const [currentDelay, setCurrentDelay] = useState<number>(delayService.getDelay());
  const [customDelay, setCustomDelay] = useState<string>('');
  const [showWarning, setShowWarning] = useState(false);
  const [pendingDelay, setPendingDelay] = useState<number | null>(null);
  const [showCalibrator, setShowCalibrator] = useState(false);

  useEffect(() => {
    setCurrentDelay(delayService.getDelay());
  }, []);

  const handleDelayChange = (delay: number) => {
    if (delay < currentDelay) {
      setPendingDelay(delay);
      setShowWarning(true);
      return;
    }
    
    delayService.setDelay(delay);
    setCurrentDelay(delay);
    setCustomDelay('');
  };

  const handleCustomDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomDelay(value);
    
    const delay = parseInt(value, 10);
    if (!isNaN(delay) && delay >= 0) {
      if (delay < currentDelay) {
        setPendingDelay(delay);
        setShowWarning(true);
      } else {
        delayService.setDelay(delay);
        setCurrentDelay(delay);
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const delay = parseInt(e.target.value, 10);
    setCustomDelay(delay.toString());
    if (delay < currentDelay) {
      setPendingDelay(delay);
      setShowWarning(true);
    } else {
      delayService.setDelay(delay);
      setCurrentDelay(delay);
    }
  };

  const confirmDelayChange = () => {
    if (pendingDelay !== null) {
      delayService.setDelay(pendingDelay);
      setCurrentDelay(pendingDelay);
      setPendingDelay(null);
    }
    setShowWarning(false);
    setCustomDelay('');
  };

  const handleCalibratedDelay = (delay: number) => {
    delayService.setDelay(delay);
    setCurrentDelay(delay);
    setCustomDelay(delay.toString());
    setShowCalibrator(false);
  };

  const delayOptions = [
    {
      icon: Tv,
      title: 'CABLE / SATELLITE',
      description: '5 second delay for traditional TV broadcasts',
      delay: 5
    },
    {
      icon: Globe,
      title: 'STREAMING SERVICE',
      description: '20 second delay for general streaming platforms',
      delay: 20
    },
    {
      icon: Video,
      title: 'F1TV',
      description: '30 second delay for F1\'s official streaming service',
      delay: 30
    }
  ];

  return (
    <div className="bg-[#151A2D] rounded-lg p-6 border border-[#1E2642]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Broadcast Delay</h2>
        <p className="text-sm text-gray-400 mt-1">Select your viewing method to sync the lights with your broadcast</p>
      </div>

      {showWarning && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">Reduce Broadcast Delay?</h3>
              <p className="text-sm text-gray-400 mt-1">
                Reducing the delay might cause you to see flag changes before they appear on your broadcast.
                Are you sure you want to continue?
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={confirmDelayChange}
                  className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Yes, Reduce Delay
                </button>
                <button
                  onClick={() => {
                    setShowWarning(false);
                    setPendingDelay(null);
                    setCustomDelay('');
                  }}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {delayOptions.map((option) => (
          <DelayOption
            key={option.title}
            {...option}
            isSelected={currentDelay === option.delay}
            onClick={() => handleDelayChange(option.delay)}
          />
        ))}
      </div>

      {/* Custom Delay Input */}
      <div className="mt-6 pt-6 border-t border-[#1E2642]">
        <div className="flex items-start space-x-3 mb-4">
          <Info className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-400">
            Fine-tune your delay if needed. Use the calibration tool during race starts to match your broadcast exactly.
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Slider and Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Custom Delay
              </label>
              <span className="text-sm text-gray-400">
                {currentDelay} seconds
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="60"
              step="1"
              value={customDelay || currentDelay}
              onChange={handleSliderChange}
              className="w-full h-2 bg-[#1A1F35] rounded-lg appearance-none cursor-pointer accent-race-blue-500"
            />
            
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={customDelay}
                onChange={handleCustomDelayChange}
                min="0"
                step="1"
                className="w-24 bg-[#1A1F35] border border-[#1E2642] rounded-lg px-3 py-1.5 text-white 
                         focus:ring-2 focus:ring-race-blue-500 focus:border-transparent text-sm"
                placeholder="Custom"
              />
              <span className="text-sm text-gray-400">seconds</span>
            </div>
          </div>

          {/* Calibration Button */}
          <button
            onClick={() => setShowCalibrator(true)}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-[#1A1F35] border border-[#1E2642] 
                     rounded-lg text-white hover:bg-[#1E2642] transition-colors"
          >
            <Timer className="w-4 h-4" />
            <span>Calculate My Exact Delay</span>
          </button>

          {showCalibrator && (
            <BroadcastDelayCalibrator onDelayCalculated={handleCalibratedDelay} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastDelay;