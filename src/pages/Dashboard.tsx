import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RaceControl from '../components/RaceControl';
import LightControl from '../components/LightControl';
import BroadcastDelay from '../components/BroadcastDelay';
import RaceSchedule from '../components/RaceSchedule';
import TrialExpiredModal from '../components/TrialExpiredModal';
import CollapsibleSection from '../components/CollapsibleSection';
import { Flag, Lightbulb, Clock, Calendar } from 'lucide-react';

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showTrialExpired, setShowTrialExpired] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (auth.user?.plan === 'trial' && !isTrialValid(auth.user)) {
      setShowTrialExpired(true);
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  const isTrialValid = (user: any) => {
    if (user.plan !== 'trial') return true;
    if (!user.trialExpires) return false;

    const now = new Date();
    const trialEnd = new Date(user.trialExpires);
    return now < trialEnd;
  };

  const handleUpgrade = () => {
    window.location.href = 'https://www.paypal.com/ncp/payment/ULSN3LZGJUHPQ';
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Race Control */}
          <div className="lg:col-span-2 space-y-6">
            <CollapsibleSection
              title="Race Control"
              subtitle="Manage race flags and light effects"
              icon={<Flag className="w-5 h-5" />}
              defaultExpanded={true}
            >
              <RaceControl />
            </CollapsibleSection>

            <CollapsibleSection
              title="Broadcast Delay"
              subtitle="Sync your lights with your broadcast"
              icon={<Clock className="w-5 h-5" />}
              defaultExpanded={false}
            >
              <BroadcastDelay />
            </CollapsibleSection>

            <CollapsibleSection
              title="Race Schedule"
              subtitle="Upcoming F1 sessions and events"
              icon={<Calendar className="w-5 h-5" />}
              defaultExpanded={false}
            >
              <RaceSchedule />
            </CollapsibleSection>
          </div>

          {/* Right Column - Light Control */}
          <div className="space-y-6">
            <CollapsibleSection
              title="Light Control"
              subtitle="Select lights to control with race flags"
              icon={<Lightbulb className="w-5 h-5" />}
              defaultExpanded={true}
            >
              <LightControl />
            </CollapsibleSection>
          </div>
        </div>

        {/* Trial Expired Modal */}
        {showTrialExpired && (
          <TrialExpiredModal
            onUpgrade={handleUpgrade}
            onClose={() => {
              setShowTrialExpired(false);
              navigate('/');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;