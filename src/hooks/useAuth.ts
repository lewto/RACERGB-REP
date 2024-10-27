import { useState, useEffect, useCallback } from 'react';
import { deviceFingerprint } from '../services/deviceFingerprint';
import { lifxService } from '../services/lifx';
import { hashPassword } from '../utils/crypto';

interface User {
  email: string;
  plan: 'trial' | 'lifetime';
  isAdmin?: boolean;
  trialStart?: string;
  lifxToken?: string | null;
  selectedDevices?: string[];
  createdAt: string;
  lastLogin: string;
  trialExpires?: string;
  deviceFingerprint?: string;
}

interface StoredUser extends User {
  password: string;
}

const DEMO_PASSWORD = 'demo123456'; // For demo purposes only

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check trial status
  const checkTrialStatus = useCallback((user: User): boolean => {
    if (user.plan !== 'trial') return true;
    if (!user.trialExpires) return false;

    const now = new Date();
    const trialEnd = new Date(user.trialExpires);
    return now < trialEnd;
  }, []);

  // Initialize LIFX service with saved token
  const initializeLIFX = useCallback((token: string) => {
    lifxService.setToken(token);
  }, []);

  const validatePassword = (password: string): boolean => {
    // Minimum 8 characters, at least one letter and one number
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Validate inputs
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      if (!validatePassword(password)) {
        throw new Error('Invalid password format');
      }

      // Special handling for demo account
      if (email.toLowerCase() === 'info@n00d.com') {
        const hashedPassword = await hashPassword(password);
        const demoHash = await hashPassword(DEMO_PASSWORD);
        if (hashedPassword !== demoHash) {
          throw new Error('Invalid email or password');
        }
      }

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
      const userData = existingUsers[email.toLowerCase()] as StoredUser | undefined;

      // For non-demo accounts, verify stored password
      if (!userData && email.toLowerCase() !== 'info@n00d.com') {
        throw new Error('Invalid email or password');
      }

      if (userData) {
        const hashedPassword = await hashPassword(password);
        if (hashedPassword !== userData.password) {
          throw new Error('Invalid email or password');
        }
      }

      // Get user-specific LIFX token
      const userLifxToken = localStorage.getItem(`lifx_token_${email.toLowerCase()}`);
      
      const user: User = {
        email: email.toLowerCase(),
        plan: 'lifetime',
        isAdmin: email.toLowerCase() === 'info@n00d.com',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        selectedDevices: [],
        lifxToken: userLifxToken || null
      };

      const token = 'session_' + Date.now();
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Initialize LIFX if we have a token for this user
      if (userLifxToken) {
        initializeLIFX(userLifxToken);
      } else {
        lifxService.disconnect();
      }
      
      setUser(user);
      setIsAuthenticated(true);
      
      return user;
    } finally {
      setIsLoading(false);
    }
  }, [initializeLIFX]);

  // Rest of the code remains the same...
  // Include all other functions and exports
};

export default useAuth;