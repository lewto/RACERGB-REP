import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useLIFX } from '../hooks/useLIFX';

const Settings: React.FC = () => {
  const { initialize, disconnect, isConnected } = useLIFX();
  const [token, setToken] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initialize(token);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#151A2D] rounded-lg p-6 border border-[#1E2642]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your LIFX connection</p>
        </div>
        <SettingsIcon className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        <div className="bg-[#0D1119] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">LIFX API Connection</h3>
              <p className="text-xs text-gray-400 mt-1">
                {isConnected ? 'Connected to LIFX API' : 'Not connected'}
              </p>
            </div>
            {isConnected ? (
              <button
                onClick={() => {
                  disconnect();
                  setIsEditing(true);
                }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-race-blue-500 hover:text-race-blue-400 transition-colors"
              >
                Connect
              </button>
            )}
          </div>

          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lifx-token" className="block text-sm font-medium text-gray-300">
                  LIFX API Token
                </label>
                <input
                  type="password"
                  id="lifx-token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-race-blue-500 focus:ring-race-blue-500 text-sm"
                  placeholder="Enter your LIFX API token"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Get your token from{' '}
                  <a
                    href="https://cloud.lifx.com/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-race-blue-500 hover:text-race-blue-400"
                  >
                    LIFX Cloud Settings
                  </a>
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm bg-race-blue-500 text-white rounded hover:bg-race-blue-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;