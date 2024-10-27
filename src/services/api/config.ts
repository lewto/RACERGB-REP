export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD ? '/api' : 'https://api.openf1.org/v1',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  POLL_INTERVAL: 500
} as const;

export const createProxyUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_CONFIG.BASE_URL}/${cleanPath}`;
};