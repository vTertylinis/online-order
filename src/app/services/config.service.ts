import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  googleApiKey?: string;
  googleMapsLibraries?: string; // e.g., "places"
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig = {};

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    try {
      // Load runtime config if present; ignore if missing
      const cfg = await firstValueFrom(this.http.get<AppConfig>('assets/config.json', { withCredentials: false }));
      this.config = cfg || {};
    } catch {
      this.config = {};
    }
  }

  get(key: keyof AppConfig): string | undefined {
    return this.config[key];
  }

  getAll(): AppConfig {
    return { ...this.config };
  }
}