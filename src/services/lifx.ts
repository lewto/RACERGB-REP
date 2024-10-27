import axios, { AxiosError } from 'axios';
import { LIFXDevice, LIFXState } from '../types/lifx';

const LIFX_API_URL = 'https://api.lifx.com/v1';
const REQUEST_TIMEOUT = 15000; // Increased timeout to 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // Increased base retry delay to 2 seconds
const CONNECTION_CHECK_INTERVAL = 60000;
const RECONNECT_DELAY = 5000;

interface APIError {
  message: string;
  status: number;
}

class LIFXService {
  private token: string | null = null;
  private retryCount: number = 0;
  private maxRetries: number = MAX_RETRIES;
  private retryDelay: number = RETRY_DELAY;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isReconnecting: boolean = false;
  private connectionAttempts: number = 0;
  private lastSuccessfulConnection: number = 0;

  setToken(token: string | null) {
    this.token = token;
    this.retryCount = 0;
    this.connectionAttempts = 0;
    
    if (token) {
      localStorage.setItem('lifx_token', token);
      this.startConnectionMonitor();
    } else {
      localStorage.removeItem('lifx_token');
      this.stopConnectionMonitor();
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('lifx_token');
  }

  disconnect() {
    this.token = null;
    localStorage.removeItem('lifx_token');
    this.stopConnectionMonitor();
    this.connectionAttempts = 0;
    this.lastSuccessfulConnection = 0;
  }

  private startConnectionMonitor() {
    this.stopConnectionMonitor();
    this.reconnectTimeout = setInterval(async () => {
      if (!this.token || this.isReconnecting) return;

      try {
        await this.getLights();
        this.lastSuccessfulConnection = Date.now();
        this.connectionAttempts = 0;
      } catch (error) {
        console.warn('LIFX connection lost, attempting to reconnect...');
        this.isReconnecting = true;
        await this.attemptReconnect();
      }
    }, CONNECTION_CHECK_INTERVAL);
  }

  private stopConnectionMonitor() {
    if (this.reconnectTimeout) {
      clearInterval(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private async attemptReconnect() {
    this.connectionAttempts++;
    const maxAttempts = 5;
    const backoffDelay = Math.min(RECONNECT_DELAY * Math.pow(2, this.connectionAttempts - 1), 30000);

    while (this.connectionAttempts < maxAttempts) {
      try {
        await this.getLights();
        console.log('LIFX connection restored');
        this.isReconnecting = false;
        this.lastSuccessfulConnection = Date.now();
        this.connectionAttempts = 0;
        return;
      } catch (error) {
        this.connectionAttempts++;
        if (this.connectionAttempts === maxAttempts) {
          console.error('Failed to reconnect to LIFX after multiple attempts');
          this.disconnect();
        } else {
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
    }
  }

  private getHeaders() {
    const token = this.getToken();
    if (!token) {
      throw new Error('LIFX API token not set');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private async handleRetry<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        
        // Don't retry on authentication errors
        if (status === 401) {
          throw error;
        }

        // Retry on rate limits, timeouts, or server errors
        if ((status === 429 || status === 500 || error.code === 'ECONNABORTED') && 
            this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);
          console.log(`Retrying request (attempt ${this.retryCount} of ${this.maxRetries}) after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.handleRetry(operation);
        }
      }
      throw error;
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const apiError: APIError = {
        message: status === 401 ? 'Invalid LIFX API token' :
                status === 429 ? 'Rate limit exceeded. Please try again in a few moments.' :
                status === 500 ? 'LIFX service is experiencing issues. Please try again later.' :
                error.code === 'ECONNABORTED' ? 'Connection timeout. Please check your internet connection and try again.' :
                'Failed to connect to LIFX. Please check your internet connection.',
        status: status || 500
      };
      console.error('LIFX API Error:', apiError);
      throw apiError;
    }
    throw error;
  }

  async getLights(): Promise<LIFXDevice[]> {
    try {
      const response = await this.handleRetry(() => 
        axios.get(`${LIFX_API_URL}/lights/all`, {
          headers: this.getHeaders(),
          timeout: REQUEST_TIMEOUT
        })
      );
      this.retryCount = 0;
      this.lastSuccessfulConnection = Date.now();
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async setState(selector: string, state: LIFXState): Promise<void> {
    try {
      await this.handleRetry(() =>
        axios.put(
          `${LIFX_API_URL}/lights/${selector}/state`,
          state,
          { 
            headers: this.getHeaders(),
            timeout: REQUEST_TIMEOUT
          }
        )
      );
      this.retryCount = 0;
      this.lastSuccessfulConnection = Date.now();
    } catch (error) {
      this.handleError(error);
    }
  }

  async setGreenFlag(selector: string, isInitial: boolean = false): Promise<void> {
    try {
      if (isInitial) {
        await this.setState(selector, {
          power: 'on',
          color: { hue: 120, saturation: 1, kelvin: 3500 },
          brightness: 1,
          duration: 0.1
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        await this.setState(selector, {
          power: 'on',
          color: { hue: 120, saturation: 1, kelvin: 3500 },
          brightness: 0.5,
          duration: 2.0
        });
      } else {
        await this.setState(selector, {
          power: 'on',
          color: { hue: 120, saturation: 1, kelvin: 3500 },
          brightness: 0.5,
          duration: 1.0
        });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async setRedFlag(selector: string): Promise<void> {
    try {
      await this.handleRetry(() =>
        axios.post(
          `${LIFX_API_URL}/lights/${selector}/effects/pulse`,
          {
            color: { hue: 0, saturation: 1, brightness: 1, kelvin: 3500 },
            from_color: { hue: 0, saturation: 1, brightness: 0.3, kelvin: 3500 },
            period: 0.5,
            cycles: 6,
            power_on: true
          },
          { headers: this.getHeaders() }
        )
      );

      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.setState(selector, {
        power: 'on',
        color: { hue: 0, saturation: 1, kelvin: 3500 },
        brightness: 1
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async setSafetyCarFlag(selector: string): Promise<void> {
    try {
      await this.handleRetry(() =>
        axios.post(
          `${LIFX_API_URL}/lights/${selector}/effects/pulse`,
          {
            color: { hue: 60, saturation: 1, brightness: 1, kelvin: 3500 },
            from_color: { hue: 60, saturation: 1, brightness: 0.3, kelvin: 3500 },
            period: 0.5,
            cycles: 6,
            power_on: true
          },
          { headers: this.getHeaders() }
        )
      );

      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.setState(selector, {
        power: 'on',
        color: { hue: 60, saturation: 1, kelvin: 3500 },
        brightness: 1
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async setCheckeredFlag(selector: string): Promise<void> {
    try {
      await this.handleRetry(() =>
        axios.post(
          `${LIFX_API_URL}/lights/${selector}/effects/pulse`,
          {
            color: { hue: 0, saturation: 0, brightness: 1, kelvin: 9000 },
            from_color: { hue: 0, saturation: 0, brightness: 0, kelvin: 2500 },
            period: 0.3,
            cycles: 10,
            power_on: true
          },
          { headers: this.getHeaders() }
        )
      );

      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.setState(selector, {
        power: 'on',
        color: { hue: 120, saturation: 1, kelvin: 3500 },
        brightness: 1
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  cleanup() {
    this.stopConnectionMonitor();
  }
}

export const lifxService = new LIFXService();