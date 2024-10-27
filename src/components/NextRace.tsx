import React from 'react';
import { useF1Schedule } from '../hooks/useF1Schedule';
import { Calendar } from 'lucide-react';

const NextRace = () => {
  const { getNextRace, formatRaceDateTime, loading, error } = useF1Schedule();
  const nextRace = getNextRace();

  if (loading) {
    return <div className="text-gray-400">Loading next race...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!nextRace) {
    return <div className="text-gray-400">No upcoming races found</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Next Race</h2>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">{nextRace.raceName}</p>
        <p className="text-gray-400">{nextRace.Circuit.circuitName}</p>
        <p className="text-race-blue-500">
          {formatRaceDateTime(nextRace.date, nextRace.time)}
        </p>
      </div>
    </div>
  );
};

export default NextRace;