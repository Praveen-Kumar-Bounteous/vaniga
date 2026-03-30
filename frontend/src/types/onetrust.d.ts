export interface ConsentState {
  hasDecided: boolean;
  strictlyNecessary: boolean; // C0001
  performance: boolean;       // C0002
  functional: boolean;        // C0003
  targeting: boolean;         // C0004
}

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  isAlwaysActive: boolean;
}