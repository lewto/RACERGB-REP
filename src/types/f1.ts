export interface RaceControlMessage {
  session_key: number;
  meeting_key: number;
  date: string;
  category: string;
  flag: string | null;
  message: string;
  scope: string | null;
  sector: number | null;
  driver_number?: string | null;
  lap_number?: number | null;
}

export interface Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  FirstPractice?: {
    date: string;
    time: string;
  };
  SecondPractice?: {
    date: string;
    time: string;
  };
  ThirdPractice?: {
    date: string;
    time: string;
  };
  SprintShootout?: {
    date: string;
    time: string;
  };
  Sprint?: {
    date: string;
    time: string;
  };
  Qualifying: {
    date: string;
    time: string;
  };
}

export interface F1Response {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      season: string;
      Races: Race[];
    };
  };
}