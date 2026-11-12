import { DestroyRef, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { menuItems } from '../models/menu-item.model';

export type AnalyticsMode = 'online_order' | 'dine_in';
type FailureReason = 'invalid_form' | 'outside_delivery_hours' | 'table_required' | 'request_failed';
type AnalyticsWindow = Window & {
  gtag?: (command: string, name: string, parameters: Record<string, unknown>) => void;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private started = false;
  private lastMode?: AnalyticsMode;

  // One subscription for the application, including direct links and Ionic cached pages.
  start(): void {
    if (this.started) return;
    this.started = true;
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(event => this.trackNavigation(event.urlAfterRedirects));
    if (this.router.navigated) this.trackNavigation(this.router.url);
  }

  checkoutFailure(reason: FailureReason, stage: 'address' | 'table' | 'submit_order', error?: unknown): void {
    const status = error instanceof HttpErrorResponse ? error.status : undefined;
    this.send('checkout_error', {
      failure_reason: reason,
      checkout_stage: stage,
      ...(status !== undefined ? { http_status: status } : {}),
    });
  }

  private trackNavigation(url: string): void {
    const path = url.split(/[?#]/)[0];
    if (this.lastMode !== this.mode) {
      this.lastMode = this.mode;
      this.send('ordering_mode_enter', {});
    }
    const match = /^\/(?:dinein\/)?item\/(\d+)$/.exec(path);
    const item = match ? menuItems.find(entry => entry.id === Number(match[1])) : undefined;
    if (!item) return;
    const price = this.mode === 'dine_in' ? item.dineInPrice ?? item.price ?? 0 : item.price ?? 0;
    this.send('view_item', {
      currency: 'EUR', value: price,
      items: [{ item_id: String(item.id), item_name: item.name,
        item_category: item.category, price, quantity: 1 }],
    });
  }

  private get mode(): AnalyticsMode {
    return /^\/dinein(?:\/|[?#]|$)/.test(this.router.url) ? 'dine_in' : 'online_order';
  }

  private send(name: string, parameters: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    try {
      // Explicit destination keeps these events in GA4, separate from the Ads tag.
      (window as AnalyticsWindow).gtag?.('event', name, {
        ...parameters, ordering_mode: this.mode, send_to: 'G-G3K8FJ9N8S',
      });
    } catch {
      // Analytics must never interrupt browsing or submission of an order.
    }
  }
}
