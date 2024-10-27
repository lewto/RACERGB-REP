import React, { useState } from 'react';
import { Lightbulb, Power, Info, X, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { useLIFX } from '../hooks/useLIFX';
import { Link } from 'react-router-dom';

interface RemoveConfirmProps {
  deviceLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const RemoveConfirm: React.FC<RemoveConfirmProps> = ({ deviceLabel, onConfirm, onCancel }) => (
  <div className="absolute inset-0 bg-[#0D1119]/95 backdrop-blur-sm flex items-center justify-center p-4 z-10">
    <div className="bg-[#1A1F35] p-6 rounded-xl border border-[#1E2642] max-w-sm w-full">
      <div className="flex items-start space-x-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-white font-medium mb-2">Remove Light?</h3>
          <p className="text-sm text-gray-400">
            Are you sure you want to remove <span className="text-white">{deviceLabel}</span>?
          </p>
          <p className="text-sm text-[#FF3B30] mt-2">
            Warning: This action cannot be undone. Once removed, the light cannot be retrieved.
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF3B30]/90 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);

const LightControl: React.FC = () => {
  const { devices, loading, error, selectedDevices, toggleDevice } = useLIFX();
  const [removingDevice, setRemovingDevice] = useState<string | null>(null);
  const [hiddenDevices, setHiddenDevices] = useState<Set<string>>(new Set());

  const handleRemove = (deviceId: string) => {
    setHiddenDevices(prev => {
      const newSet = new Set(prev);
      newSet.add(deviceId);
      return newSet;
    });
    if (selectedDevices.has(deviceId)) {
      toggleDevice(deviceId);
    }
    setRemovingDevice(null);
  };

  const visibleDevices = devices.filter(device => !hiddenDevices.has(device.id));

  if (loading) {
    return (
      <div className="bg-[#0D1119] rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1119] rounded-xl p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Light Control</h2>
          <p className="text-sm text-gray-400 mt-1">Select lights to control with race flags</p>
        </div>
        <div className="flex items-center space-x-2">
          <Power className={`w-5 h-5 ${visibleDevices.length ? 'text-[#34C759]' : 'text-gray-500'}`} />
          <span className="text-sm text-gray-400">
            {selectedDevices.size} of {visibleDevices.length} Added
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 text-red-500 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Connection Error</p>
            <p className="text-sm mt-1">{error}</p>
            <Link 
              to="/settings" 
              className="inline-flex items-center space-x-2 text-sm mt-3 text-blue-500 hover:text-blue-400 transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Check LIFX Connection</span>
            </Link>
          </div>
        </div>
      )}

      {visibleDevices.length > 0 && (
        <div className="bg-[#1A1F35] p-4 rounded-lg border border-[#1E2642] mb-4">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-400">
              <p>To identify your lights:</p>
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Check your LIFX app for the exact names of your lights</li>
                <li>Match the names and groups shown below</li>
                <li>Click to add or remove lights from control</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {visibleDevices.map(device => (
          <div
            key={device.id}
            className={`relative flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              selectedDevices.has(device.id)
                ? 'bg-[#1A1F35] ring-1 ring-white/20'
                : 'bg-[#151A2D]'
            } border border-[#1E2642] group`}
          >
            <button
              className="flex-1 flex items-center justify-between"
              onClick={() => toggleDevice(device.id)}
            >
              <div className="flex items-center space-x-3">
                <Lightbulb 
                  className={selectedDevices.has(device.id) ? 'text-[#34C759]' : 'text-gray-400'} 
                  size={16}
                />
                <div className="text-left">
                  <span className="text-white text-sm block">{device.label}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400">
                      Group: {device.group.name}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-400">
                      Location: {device.location.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${device.connected ? 'bg-[#34C759]' : 'bg-gray-500'}`} />
                <span className={`text-xs ${selectedDevices.has(device.id) ? 'text-[#34C759]' : 'text-gray-400'}`}>
                  {selectedDevices.has(device.id) ? 'ADDED' : 'NOT ADDED'}
                </span>
              </div>
            </button>
            <button
              onClick={() => setRemovingDevice(device.id)}
              className="ml-4 p-1.5 rounded-lg hover:bg-[#FF3B30]/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <X className="w-4 h-4 text-[#FF3B30]" />
            </button>
          </div>
        ))}

        {visibleDevices.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="h-8 w-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No LIFX devices found</p>
            <p className="text-sm text-gray-500 mt-1">
              Make sure your lights are:
            </p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Connected to Wi-Fi</li>
              <li>• Added to your LIFX account</li>
              <li>• Using the correct API key</li>
            </ul>
            <Link
              to="/settings"
              className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-400 mt-4 transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Check LIFX Connection</span>
            </Link>
          </div>
        )}
      </div>

      {/* Tip for non-responsive lights */}
      {visibleDevices.length > 0 && (
        <div className="mt-4 flex items-start space-x-2 text-sm text-gray-400 bg-[#1A1F35] p-3 rounded-lg border border-[#1E2642]">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p>
            Lights not responding? Go to{' '}
            <Link to="/settings" className="text-blue-500 hover:text-blue-400 transition-colors">
              Settings
            </Link>
            {' '}to verify your LIFX API connection
          </p>
        </div>
      )}

      {removingDevice && (
        <RemoveConfirm
          deviceLabel={devices.find(d => d.id === removingDevice)?.label || ''}
          onConfirm={() => handleRemove(removingDevice)}
          onCancel={() => setRemovingDevice(null)}
        />
      )}
    </div>
  );
};

export default LightControl;