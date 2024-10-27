import { API_CONFIG, createProxyUrl } from './config';
import type { RaceControlMessage } from '../../types/f1';

class OpenF1API {
  private state = {
    testMessage: null as RaceControlMessage | null,
    testMessageTime: 0,
    connectionStatus: false,
    lastSuccessfulFetch: 0,
    retryAttempts: 0
  };

  private async fetchWithRetry(endpoint: string, retryCount = 0): Promise<Response> {
    try {
      const url = createProxyUrl(endpoint);
      console.log('Fetching:', url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
        const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(endpoint, retryCount + 1);
      }
      throw error;
    }
  }

  async getRaceControlMessages(): Promise<RaceControlMessage[]> {
    try {
      if (this.state.testMessage && Date.now() - this.state.testMessageTime < 120000) {
        return [this.state.testMessage];
      }

      const response = await this.fetchWithRetry('race_control?session_key=latest&limit=10');
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.warn('Invalid API response format');
        return [];
      }

      const messages = data
        .map(msg => ({
          session_key: msg.session_key || 0,
          meeting_key: msg.meeting_key || 0,
          date: msg.date || new Date().toISOString(),
          category: msg.category || '',
          flag: msg.flag || null,
          message: msg.message || '',
          scope: msg.scope || null,
          sector: msg.sector || null
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      this.state.lastSuccessfulFetch = Date.now();
      this.state.retryAttempts = 0;
      this.state.connectionStatus = true;
      return messages;

    } catch (error) {
      this.state.connectionStatus = false;
      console.error('Race control API error:', error);
      return this.state.testMessage ? [this.state.testMessage] : [];
    }
  }

  async isSessionActive(): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry('session?status=active');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error('Failed to check session status:', error);
      return false;
    }
  }

  setTestMessage(message: RaceControlMessage): void {
    this.state.testMessage = message;
    this.state.testMessageTime = Date.now();
  }

  clearTestMessage(): void {
    this.state.testMessage = null;
    this.state.testMessageTime = 0;
  }
}

export const openF1API = new OpenF1API();