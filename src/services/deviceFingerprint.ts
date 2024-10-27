import FingerprintJS from '@fingerprintjs/fingerprintjs';

class DeviceFingerprintService {
  private fp: any = null;

  async initialize() {
    this.fp = await FingerprintJS.load();
  }

  async getFingerprint(): Promise<string> {
    if (!this.fp) {
      await this.initialize();
    }
    const result = await this.fp.get();
    return result.visitorId;
  }

  async hasExistingTrial(): Promise<boolean> {
    const fingerprint = await this.getFingerprint();
    const trials = JSON.parse(localStorage.getItem('trial_devices') || '{}');
    return !!trials[fingerprint];
  }

  async recordTrial(email: string): Promise<void> {
    const fingerprint = await this.getFingerprint();
    const trials = JSON.parse(localStorage.getItem('trial_devices') || '{}');
    
    trials[fingerprint] = {
      email,
      timestamp: Date.now(),
      ipHash: await this.getIpHash()
    };

    localStorage.setItem('trial_devices', JSON.stringify(trials));
  }

  private async getIpHash(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const ipAddress = data.ip;
      
      // Create a hash of the IP address
      const encoder = new TextEncoder();
      const data2 = encoder.encode(ipAddress);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data2);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Failed to get IP hash:', error);
      return '';
    }
  }
}

export const deviceFingerprint = new DeviceFingerprintService();