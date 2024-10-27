export const API_CONFIG = {
  BASE_URL: 'https://api.openf1.org/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  POLL_INTERVAL: 500 // 500ms between polls
} as const;

export const ERGAST_CONFIG = {
  BASE_URL: 'https://ergast.com/api/f1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;