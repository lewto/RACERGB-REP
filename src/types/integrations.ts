export type IntegrationProvider = 'lifx' | 'hue' | 'nanoleaf';

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  token: string;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfig {
  name: string;
  logo: string;
  authUrl: string;
  scopes: string[];
  isAvailable: boolean;
  comingSoon?: boolean;
}

export const INTEGRATION_CONFIGS: Record<IntegrationProvider, IntegrationConfig> = {
  lifx: {
    name: 'LIFX',
    logo: '/logos/lifx.svg',
    authUrl: 'https://cloud.lifx.com/settings',
    scopes: ['remote_control'],
    isAvailable: true
  },
  hue: {
    name: 'Philips Hue',
    logo: '/logos/hue.svg',
    authUrl: 'https://developers.meethue.com/',
    scopes: ['lights'],
    isAvailable: false,
    comingSoon: true
  },
  nanoleaf: {
    name: 'Nanoleaf',
    logo: '/logos/nanoleaf.svg',
    authUrl: 'https://nanoleaf.me/en-US/integration/',
    scopes: ['read', 'write'],
    isAvailable: false,
    comingSoon: true
  }
};