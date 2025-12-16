import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface AppConfig {
  googleMapsApiKey?: string;
  googleMapsLibraries?: string; // e.g., "places"
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig = {
    googleMapsApiKey: environment.googleMapsApiKey,
    googleMapsLibraries: 'places',
  };

  // Kept for APP_INITIALIZER compatibility; now a no-op
  async load(): Promise<void> {
    return Promise.resolve();
  }

  get(key: keyof AppConfig): string | undefined {
    return this.config[key];
  }

  getAll(): AppConfig {
    return { ...this.config };
  }
}