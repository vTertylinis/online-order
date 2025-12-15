import { Injectable, inject } from '@angular/core';
import { ConfigService } from './config.service';

declare global {
  interface Window { gmapsLoaderPromise?: Promise<void>; }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private config = inject(ConfigService);

  async load(): Promise<void> {
    // Already loaded
    if (typeof (window as any).google !== 'undefined' && (window as any).google.maps) {
      return;
    }

    // Ensure single in-flight loader
    if (window.gmapsLoaderPromise) {
      return window.gmapsLoaderPromise;
    }

    const apiKey = (this.config.get('googleApiKey') || '').trim();
    const libraries = (this.config.get('googleMapsLibraries') || 'places').trim();

    window.gmapsLoaderPromise = new Promise<void>((resolve, reject) => {
      // If script already present, wait for it
      const existing = document.getElementById('gmaps-script') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load')));
        return;
      }

      const script = document.createElement('script');
      script.id = 'gmaps-script';
      const base = 'https://maps.googleapis.com/maps/api/js';
      const params = new URLSearchParams();
      if (apiKey) params.set('key', apiKey);
      if (libraries) params.set('libraries', libraries);
      script.src = `${base}?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => reject(new Error('Google Maps script failed to load')));
      document.head.appendChild(script);
    });

    return window.gmapsLoaderPromise;
  }
}