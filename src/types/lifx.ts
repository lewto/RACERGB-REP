export interface LIFXColor {
  hue: number;
  saturation: number;
  kelvin: number;
}

export interface LIFXGroup {
  id: string;
  name: string;
}

export interface LIFXLocation {
  id: string;
  name: string;
}

export interface LIFXDevice {
  id: string;
  uuid: string;
  label: string;
  connected: boolean;
  power: "on" | "off";
  color: LIFXColor;
  brightness: number;
  group: LIFXGroup;
  location: LIFXLocation;
}

export interface LIFXState {
  power: "on" | "off";
  color: LIFXColor;
  brightness: number;
  duration?: number;
}