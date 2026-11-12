/// <reference types="google.maps" />

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loadPromise?: Promise<void>;

  load(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
      return Promise.resolve();
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const apiKey = environment.googleMapsApiKey;
      if (!apiKey || apiKey.includes('YOUR_')) {
        console.error('Google Maps API key is not set. Update environments.');
      }

      const scriptId = 'google-maps-js';
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      const callbackName = '__onlineOrderGoogleMapsReady';
      const mapsWindow = window as Window & { __onlineOrderGoogleMapsReady?: () => void };
      mapsWindow[callbackName] = () => {
        delete mapsWindow[callbackName];
        resolve();
      };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=${callbackName}`;
      script.onerror = () => {
        delete mapsWindow[callbackName];
        reject(new Error('Google Maps failed to load'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}
