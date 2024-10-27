import React, { useState } from 'react';
import { useF1Schedule } from '../hooks/useF1Schedule';
import { format, parseISO, isAfter, isBefore, addMinutes } from 'date-fns';
import { Clock, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SessionTimeProps {
  label: string;
  date: string;
  time: string;
  type: 'practice' | 'qualifying' | 'sprint' | 'race' | 'sprint_qualifying';
}

const SessionTime: React.FC<SessionTimeProps> = ({ label, date, time, type }) => {
  const sessionDateTime = parseISO(`${date}T${time}`);
  const formattedTime = format(sessionDateTime, 'h:mm a');
  const formattedDate = format(sessionDateTime, 'EEE, MMM d');
  const now = new Date();
  const sessionStart = sessionDateTime;
  const sessionEnd = addMinutes(sessionStart, 120); // 2 hour session
  const isLive = now >= sessionStart && now <= sessionEnd;
  const isUpcoming = now < sessionStart && now >= addMinutes(sessionStart, -30);
  const isCompleted = now > sessionEnd;
  
  const getBadgeColor = () => {
    if (isCompleted) return 'bg-gray-500/10 text-gray-500';
    if (isLive) return 'bg-[#34C759]/10 text-[#34C759] animate-pulse';
    if (isUpcoming) return 'bg-yellow-500/10 text-yellow-500';
    switch (type) {
      case 'practice':
        return 'bg-blue-500/10 text-blue-500';
      case 'qualifying':
        return 'bg-purple-500/10 text-purple-500';
      case 'sprint':
        return 'bg-orange-500/10 text-orange-500';
      case 'sprint_qualifying':
        return 'bg-pink-500/10 text-pink-500';
      case 'race':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getSessionStatus = () => {
    if (isCompleted) return '• Completed';
    if (isLive) return '• LIVE';
    if (isUpcoming) return '• Starting Soon';
    return '';
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#151A2D]/50">
      <div className="flex items-center space-x-3">
        <div className={cn('px-2 py-1 rounded text-xs font-medium flex items-center space-x-1', getBadgeColor())}>
          {isLive && (
            <span className="w-1.5 h-1.5 bg-current rounded-full mr-1" />
          )}
          <span>{label}</span>
          <span>{getSessionStatus()}</span>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
        <div className="flex items-center space-x-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{formattedTime}</span>
        </div>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>
    </div>
  );
};

const RaceSchedule: React.FC = () => {
  const { races, loading, error } = useF1Schedule();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <div className="bg-[#151A2D] rounded-lg p-6 border border-[#1E2642]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#151A2D] rounded-lg p-6 border border-[#1E2642]">
        <div className="text-red-500 text-center">
          <p>Failed to load race schedule</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const upcomingRaces = races.filter(race => {
    const raceDate = parseISO(`${race.date}T${race.time}`);
    const now = new Date();
    const raceEnd = addMinutes(raceDate, 240); // Race + 4 hours buffer
    return isBefore(now, raceEnd);
  });

  const displayedRaces = isExpanded ? upcomingRaces : upcomingRaces.slice(0, 5);

  return (
    <div className="bg-[#151A2D] rounded-lg p-6 border border-[#1E2642]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Formula 1 Calendar</h2>
        <span className="text-xs text-gray-400 px-3 py-1 rounded bg-[#1E2642]">
          2024 Season
        </span>
      </div>

      <div className="space-y-6">
        {displayedRaces.map((race) => (
          <div key={race.round} className="bg-[#0D1119] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-race-blue-500"></div>
                <span className="text-sm text-gray-400">ROUND {race.round}</span>
              </div>
              <span className="text-xs text-gray-400">
                {format(parseISO(`${race.date}T${race.time}`), 'MMM d, yyyy')}
              </span>
            </div>

            <h3 className="text-white font-medium mb-1">{race.raceName}</h3>
            <p className="text-sm text-gray-400 mb-4">{race.Circuit.circuitName}</p>

            <div className="space-y-2">
              {race.FirstPractice && (
                <SessionTime
                  label="Practice 1"
                  date={race.FirstPractice.date}
                  time={race.FirstPractice.time}
                  type="practice"
                />
              )}
              {race.SecondPractice && (
                <SessionTime
                  label="Practice 2"
                  date={race.SecondPractice.date}
                  time={race.SecondPractice.time}
                  type="practice"
                />
              )}
              {race.ThirdPractice && (
                <SessionTime
                  label="Practice 3"
                  date={race.ThirdPractice.date}
                  time={race.ThirdPractice.time}
                  type="practice"
                />
              )}
              {race.Sprint && (
                <SessionTime
                  label="Sprint"
                  date={race.Sprint.date}
                  time={race.Sprint.time}
                  type="sprint"
                />
              )}
              {race.SprintQualifying && (
                <SessionTime
                  label="Sprint Qualifying"
                  date={race.SprintQualifying.date}
                  time={race.SprintQualifying.time}
                  type="sprint_qualifying"
                />
              )}
              <SessionTime
                label="Qualifying"
                date={race.Qualifying.date}
                time={race.Qualifying.time}
                type="qualifying"
              />
              <SessionTime
                label="Race"
                date={race.date}
                time={race.time}
                type="race"
              />
            </div>
          </div>
        ))}
      </div>

      {upcomingRaces.length > 5 && (
        <div className="mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#1A1F35] rounded-lg hover:bg-[#1E2642] transition-colors text-sm"
          >
            <span className="text-gray-400">
              {isExpanded ? 'Show Less' : `Show ${upcomingRaces.length - 5} More Races`}
            </span>
            <ChevronDown className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </button>
        </div>
      )}

      {upcomingRaces.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No upcoming races scheduled</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for the next season's calendar</p>
        </div>
      )}
    </div>
  );
};

export default RaceSchedule;