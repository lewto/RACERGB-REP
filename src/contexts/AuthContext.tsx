import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  email: string;
  plan: 'trial' | 'lifetime';
  isAdmin?: boolean;
  lifxToken?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, plan: 'trial' | 'lifetime') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  signup: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const mockUser = {
      email,
      plan: 'lifetime',
      isAdmin: email === 'info@n00d.com'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  }, []);

  const signup = useCallback(async (email: string, password: string, plan: 'trial' | 'lifetime') => {
    const newUser = {
      email,
      plan,
      isAdmin: email === 'info@n00d.com'
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}