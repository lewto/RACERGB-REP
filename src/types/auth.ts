export interface User {
  email: string;
  plan: 'trial' | 'lifetime';
  isAdmin?: boolean;
  createdAt: string;
  lastLogin: string;
  trialStart?: string;
  lifxToken?: string | null;
  selectedDevices?: string[];
  paymentVerified?: boolean;
  broadcastDelay?: number;
}

export interface AdminStats {
  totalUsers: number;
  trialUsers: number;
  lifetimeUsers: number;
  revenueTotal: number;
}