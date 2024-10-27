import React, { useState } from 'react';
import { Flag, AlertTriangle, AlertOctagon, Car, Square, Radio, ChevronDown } from 'lucide-react';
import { useLIFX } from '../hooks/useLIFX';
import { setTestMessage, clearTestMessage } from '../services/openf1';
import { cn } from '../lib/utils';

const TestApiControls: React.FC = () => {
  const { setFlag, isConnected, selectedDevices } = useLIFX();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFlagClick = async (flagType: string) => {
    if (!isConnected || selectedDevices.size === 0) {
      console.warn('LIFX not connected or no devices selected');
      return;
    }

    try {
      const flagMapping: Record<string, string> = {
        'GREEN': 'green',
        'YELLOW': 'yellow',
        'RED': 'red',
        'SAFETY_CAR': 'safety',
        'VIRTUAL_SC': 'safety',
        'CHECKERED': 'checkered',
        'CLEAR': 'green'
      };

      const lifxFlag = flagMapping[flagType];
      if (!lifxFlag) {
        console.error('Unknown flag type:', flagType);
        return;
      }

      const testMessage = {
        session_key: 9999,
        meeting_key: 9999,
        date: new Date().toISOString(),
        category: flagType === 'SAFETY_CAR' || flagType === 'VIRTUAL_SC' ? 'SafetyCar' : 'Flag',
        flag: flagType,
        message: `${flagType} FLAG`,
        scope: 'Track',
        sector: null,
        lap_number: null,
        driver_number: null
      };

      setTestMessage(testMessage);
      await setFlag(lifxFlag as any);

    } catch (error) {
      console.error('Failed to set test flag:', error);
    }
  };

  const handleClearTest = () => {
    clearTestMessage();
  };

  return (
    <div className="space-y-6">
      {/* Track Flags */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Track Flags</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleFlagClick('GREEN')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors"
          >
            <Flag className="w-4 h-4 text-[#34C759]" />
            <span className="text-[#34C759]">Green Flag</span>
          </button>

          <button
            onClick={() => handleFlagClick('RED')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors"
          >
            <AlertOctagon className="w-4 h-4 text-[#FF3B30]" />
            <span className="text-[#FF3B30]">Red Flag</span>
          </button>

          <button
            onClick={() => handleFlagClick('YELLOW')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500">Yellow Flag</span>
          </button>

          <button
            onClick={() => handleFlagClick('CHECKERED')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors"
          >
            <Square className="w-4 h-4 text-white" />
            <span className="text-white">Checkered Flag</span>
          </button>
        </div>
      </div>

      {/* Safety Car */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Safety Car</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleFlagClick('SAFETY_CAR')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors"
          >
            <Car className="w-4 h-4 text-orange-500" />
            <span className="text-orange-500">Safety Car</span>
          </button>

          <button
            onClick={() => handleFlagClick('VIRTUAL_SC')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors"
          >
            <Radio className="w-4 h-4 text-orange-500" />
            <span className="text-orange-500">Virtual SC</span>
          </button>
        </div>
      </div>

      {/* Clear Test */}
      <button
        onClick={handleClearTest}
        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#1A1F35] hover:bg-[#1E2642] border border-[#1E2642] transition-colors text-gray-400 hover:text-white"
      >
        <Flag className="w-4 h-4" />
        <span>Clear Test Mode</span>
      </button>

      {/* Info Text */}
      <div className="text-sm text-gray-400 bg-[#1A1F35] p-4 rounded-lg">
        <p>Test panel simulates OpenF1 API race control messages:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Track-wide flags (Green, Red, Yellow, Checkered)</li>
          <li>Safety Car and Virtual Safety Car</li>
          <li>Track Clear messages</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApiControls;