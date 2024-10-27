import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onDelayCalculated: (delay: number) => void;
}

const BroadcastDelayCalibrator = ({ onDelayCalculated }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [userClickTime, setUserClickTime] = useState<number | null>(null);
  const [calculatedDelay, setCalculatedDelay] = useState<number | null>(null);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setUserClickTime(null);
    setCalculatedDelay(null);
  };

  const handleUserClick = () => {
    if (!startTime || !isRunning) return;
    
    const clickTime = Date.now();
    setUserClickTime(clickTime);
    setIsRunning(false);
    
    const delay = Math.round((clickTime - startTime) / 1000);
    setCalculatedDelay(delay);
    onDelayCalculated(delay);
  };

  const reset = () => {
    setIsRunning(false);
    setStartTime(null);
    setUserClickTime(null);
    setCalculatedDelay(null);
  };

  return (
    <div className="bg-[#1A1F35] p-4 rounded-lg border border-[#1E2642]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-race-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-white">Delay Calibration</h3>
            <p className="text-xs text-gray-400">Calculate your exact broadcast delay</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!isRunning && !calculatedDelay && (
          <div className="text-sm text-gray-400">
            <p>To calibrate your broadcast delay:</p>
            <ol className="mt-2 space-y-2 list-decimal pl-4">
              <li>Click "Start Calibration" below</li>
              <li>Watch your F1 broadcast</li>
              <li>Click "Mark Broadcast Time" as soon as you see the session start (green flag/lights)</li>
            </ol>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-6">
            <div className="text-2xl font-bold text-white mb-2">
              Waiting for broadcast...
            </div>
            <button
              onClick={handleUserClick}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark Broadcast Time
            </button>
          </div>
        )}

        {calculatedDelay !== null && (
          <div className="text-center py-4">
            <div className="text-lg text-white mb-2">
              Your broadcast delay is approximately:
            </div>
            <div className="text-3xl font-bold text-race-blue-500 mb-4">
              {calculatedDelay} seconds
            </div>
            <button
              onClick={reset}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#151A2D] text-white rounded-lg hover:bg-[#1E2642] transition-colors mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Calibrate Again</span>
            </button>
          </div>
        )}

        {!isRunning && !calculatedDelay && (
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-race-blue-500 text-white rounded-lg hover:bg-race-blue-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Start Calibration</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BroadcastDelayCalibrator;