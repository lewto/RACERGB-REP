import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Sliders, Lightbulb, Radio, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LIFXSetup from '../components/LIFXSetup';
import BroadcastDelay from '../components/BroadcastDelay';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F1A] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Manage your app preferences and connections</p>
          </div>
          <SettingsIcon className="w-6 h-6 text-gray-400" />
        </div>

        {/* LIFX Connection */}
        <div className="bg-[#151A2D] rounded-xl p-6 border border-[#1E2642]">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">LIFX Connection</h2>
          </div>
          <LIFXSetup />
        </div>

        {/* Broadcast Settings */}
        <div className="bg-[#151A2D] rounded-xl p-6 border border-[#1E2642]">
          <div className="flex items-center space-x-3 mb-6">
            <Radio className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Broadcast Settings</h2>
          </div>
          <BroadcastDelay />
        </div>

        {/* App Preferences */}
        <div className="bg-[#151A2D] rounded-xl p-6 border border-[#1E2642]">
          <div className="flex items-center space-x-3 mb-6">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">App Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Auto-connect on startup</h3>
                <p className="text-xs text-gray-400 mt-1">Automatically connect to LIFX when app starts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                            after:start-[2px] after:bg-white after:border-gray-300 after:border 
                            after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 bg-[#151A2D] hover:bg-[#1A1F35] 
                   text-red-500 py-3 px-4 rounded-xl border border-[#1E2642] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;