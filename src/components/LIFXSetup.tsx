import React, { useState } from 'react';
import { useLIFX } from '../hooks/useLIFX';
import { AlertTriangle, Save } from 'lucide-react';

const LIFXSetup = () => {
  const [token, setToken] = useState('');
  const { initialize, isConnected, error } = useLIFX();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initialize(token);
  };

  if (isConnected) {
    return (
      <div className="text-green-500 font-medium">
        LIFX Connected Successfully
      </div>
    );
  }

  return (
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
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-race-blue-500 focus:ring-race-blue-500"
          placeholder="Enter your LIFX API token"
        />
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Save className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-500 font-medium">Important: Save Your Token</p>
              <p className="text-yellow-400 mt-1">
                LIFX tokens cannot be viewed after creation. Before leaving the LIFX website:
              </p>
              <ol className="mt-2 space-y-1 text-yellow-400 list-decimal ml-4">
                <li>Copy your new token</li>
                <li>Save it in a secure text file</li>
                <li>Store it somewhere safe</li>
              </ol>
              <p className="text-yellow-400 mt-2">
                If you lose your token, you'll need to generate a new one and reconnect.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-race-blue-500 hover:bg-race-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-race-blue-500"
      >
        Connect LIFX
      </button>
    </form>
  );
};

export default LIFXSetup;