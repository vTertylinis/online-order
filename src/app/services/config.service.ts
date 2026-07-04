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

  /**
   * Master switch for the delivery / online-ordering flow. When false the app
   * runs as a menu-only site; dine-in is never affected. Controlled by
   * `environment.onlineOrderingEnabled` — flip it and redeploy to restore.
   */
  get isOnlineOrderingEnabled(): boolean {
    return environment.onlineOrderingEnabled !== false;
  }

  getAll(): AppConfig {
    return { ...this.config };
  }
}