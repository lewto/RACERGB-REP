import axios, { AxiosInstance } from 'axios';
import { RaceControlMessage } from '../types/f1';

const API_CONFIG = {
  BASE_URL: 'https://api.openf1.org/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  POLL_INTERVAL: 1000
} as const;

const createProxyUrl = (endpoint: string) => {
  return `https://corsproxy.io/?${encodeURIComponent(`${API_CONFIG.BASE_URL}${endpoint}`)}`;
};

class OpenF1Service {
  private api: AxiosInstance;
  private testMessage: RaceControlMessage | null = null;
  private lastTestMessageTime: number = 0;
  private lastFlagState: string | null = null;
  private connectionStatus: boolean = false;
  private heartbeatInterval: number | null = null;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    this.api = axios.create({
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    this.setupInterceptors();
    this.startHeartbeat();
  }

  private setupInterceptors(): void {
    this.api.interceptors.response.use(
      response => response,
      async error => {
        if (error.code === 'ECONNABORTED' || error.response?.status === 404 || error.response?.status === 429) {
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.api.request(error.config);
          }
        }
        throw error;
      }
    );
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = window.setInterval(async () => {
      try {
        await this.api.get(createProxyUrl('/status'));
        if (!this.connectionStatus) {
          console.log('OpenF1 API connection restored');
          this.connectionStatus = true;
          this.retryCount = 0;
        }
      } catch (error) {
        if (this.connectionStatus) {
          console.warn('OpenF1 API connection lost');
          this.connectionStatus = false;
        }
      }
    }, 30000);
  }

  private logFlagChange(newFlag: string, source: 'API' | 'Test'): void {
    if (newFlag !== this.lastFlagState) {
      console.log(`[${source}] Flag changed: ${this.lastFlagState || 'NONE'} -> ${newFlag}`);
      this.lastFlagState = newFlag;
    }
  }

  setTestMessage(message: RaceControlMessage): void {
    this.testMessage = {
      ...message,
      date: new Date().toISOString()
    };
    this.lastTestMessageTime = Date.now();
    this.logFlagChange(message.flag || 'NONE', 'Test');
  }

  clearTestMessage(): void {
    this.testMessage = null;
    this.lastTestMessageTime = 0;
  }

  async getRaceControlMessages(): Promise<RaceControlMessage[]> {
    if (this.testMessage && Date.now() - this.lastTestMessageTime < 120000) {
      return [this.testMessage];
    }

    try {
      const response = await this.api.get<RaceControlMessage[]>(createProxyUrl('/race_control'), {
        params: { 
          session_key: 'latest',
          limit: 10
        }
      });

      if (!response.data) {
        return [];
      }

      const messages = [...response.data].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (messages.length > 0 && messages[0].flag) {
        this.logFlagChange(messages[0].flag, 'API');
      }

      this.retryCount = 0;
      return messages;
    } catch (error) {
      console.error('Race control API error:', error);
      return this.testMessage ? [this.testMessage] : [];
    }
  }

  async getCurrentFlag(): Promise<string> {
    try {
      const messages = await this.getRaceControlMessages();
      
      if (!messages || messages.length === 0) {
        return 'green';
      }

      const relevantMessages = messages.filter(msg => (
        (msg.category === 'Flag' && msg.scope === 'Track') ||
        (msg.category === 'SafetyCar') ||
        msg.message?.includes('SAFETY CAR') ||
        msg.message?.includes('VIRTUAL SAFETY CAR')
      ));

      if (relevantMessages.length === 0) {
        return 'green';
      }

      const latestMessage = relevantMessages[0];

      if (
        latestMessage.category === 'SafetyCar' ||
        latestMessage.message?.includes('SAFETY CAR') ||
        latestMessage.message?.includes('VIRTUAL SAFETY CAR')
      ) {
        return 'safety';
      }

      switch (latestMessage.flag?.toUpperCase()) {
        case 'RED':
          return 'red';
        case 'YELLOW':
        case 'DOUBLE YELLOW':
          return 'yellow';
        case 'CHEQUERED':
          return 'checkered';
        case 'CLEAR':
        case 'GREEN':
          return 'green';
        default:
          return 'green';
      }
    } catch (error) {
      console.error('Failed to get current flag:', error);
      return 'green';
    }
  }

  async isSessionActive(): Promise<boolean> {
    if (this.testMessage && Date.now() - this.lastTestMessageTime < 120000) {
      return true;
    }

    try {
      const messages = await this.getRaceControlMessages();
      
      if (!messages || messages.length === 0) {
        return false;
      }

      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const latestMessage = messages[0];
      
      return new Date(latestMessage.date) > twoMinutesAgo;
    } catch (error) {
      console.error('Failed to check session status:', error);
      return false;
    }
  }

  cleanup(): void {
    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const openF1Service = new OpenF1Service();

export const getRaceControlMessages = () => openF1Service.getRaceControlMessages();
export const getCurrentFlag = () => openF1Service.getCurrentFlag();
export const isSessionActive = () => openF1Service.isSessionActive();
export const setTestMessage = (message: RaceControlMessage) => openF1Service.setTestMessage(message);
export const clearTestMessage = () => openF1Service.clearTestMessage();