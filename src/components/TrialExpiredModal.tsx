import React from 'react';
import { Shield, X } from 'lucide-react';

interface TrialExpiredModalProps {
  onUpgrade: () => void;
  onClose: () => void;
}

const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({ onUpgrade, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#151A2D] rounded-xl border border-[#1E2642] max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-white">Trial Expired</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Your free trial has ended. Upgrade to lifetime access to continue using Race RGB
          with all features unlocked.
        </p>

        <div className="bg-[#1A1F35] rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-2">Lifetime Access Includes:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Unlimited race weekends</li>
            <li>• Real-time flag synchronization</li>
            <li>• Full LIFX integration</li>
            <li>• Race calendar access</li>
            <li>• Custom broadcast delays</li>
            <li>• Future feature updates</li>
          </ul>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Upgrade Now - $7 USD
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredModal;