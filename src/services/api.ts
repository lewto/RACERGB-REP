import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  signup: async (email: string, password: string, plan: string) => {
    const { data } = await api.post('/auth/signup', { email, password, plan });
    return data;
  },
  verifyToken: async () => {
    const { data } = await api.get('/auth/verify');
    return data;
  }
};

export const users = {
  updateProfile: async (userId: string, updates: any) => {
    const { data } = await api.patch(`/users/${userId}`, updates);
    return data;
  },
  getIntegrations: async () => {
    const { data } = await api.get('/users/integrations');
    return data;
  }
};

export const integrations = {
  add: async (provider: string, token: string, settings?: any) => {
    const { data } = await api.post('/integrations', { provider, token, settings });
    return data;
  },
  remove: async (integrationId: string) => {
    await api.delete(`/integrations/${integrationId}`);
  },
  update: async (integrationId: string, updates: any) => {
    const { data } = await api.patch(`/integrations/${integrationId}`, updates);
    return data;
  }
};

export const payments = {
  createSession: async (plan: string) => {
    const { data } = await api.post('/payments/create-session', { plan });
    return data;
  },
  verifyPayment: async (sessionId: string) => {
    const { data } = await api.post('/payments/verify', { sessionId });
    return data;
  }
};

export default api;