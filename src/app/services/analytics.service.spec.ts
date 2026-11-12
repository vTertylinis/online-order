import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const events = new Subject<NavigationEnd>();
  const router = { url: '/home', navigated: false, events };
  const send = vi.fn();
  const analyticsWindow = window as Window & { gtag?: typeof send };
  let original: typeof analyticsWindow.gtag;
  let service: AnalyticsService;

  beforeEach(() => {
    router.url = '/home';
    send.mockReset();
    original = analyticsWindow.gtag;
    analyticsWindow.gtag = send;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });
    service = TestBed.inject(AnalyticsService);
    service.start();
  });
  afterEach(() => { analyticsWindow.gtag = original; TestBed.resetTestingModule(); });

  function visit(url: string) {
    router.url = url;
    events.next(new NavigationEnd(1, url, url));
  }

  it('counts mode entry once per mode transition and product detail on each visit', () => {
    service.start(); // Repeated initialization must not duplicate subscriptions.
    visit('/item/51?table=private');
    visit('/home');
    visit('/dinein/item/51');
    visit('/dinein/home');
    visit('/dinein/item/51');
    const entries = send.mock.calls.filter(call => call[1] === 'ordering_mode_enter');
    const views = send.mock.calls.filter(call => call[1] === 'view_item');
    expect(entries.map(call => call[2].ordering_mode)).toEqual(['online_order', 'dine_in']);
    expect(views).toHaveLength(3);
    expect(views[0][2].items[0].item_id).toBe('51');
    expect(JSON.stringify(send.mock.calls)).not.toContain('private');
  });

  it('sends only an allowlisted failure reason, stage and HTTP status', () => {
    visit('/dinein/table');
    send.mockClear();
    service.checkoutFailure('request_failed', 'submit_order', new HttpErrorResponse({
      status: 503, url: 'https://private.invalid/table/12', error: { phone: 'secret' },
    }));
    expect(send).toHaveBeenCalledWith('event', 'checkout_error', {
      failure_reason: 'request_failed', checkout_stage: 'submit_order', http_status: 503,
      ordering_mode: 'dine_in', send_to: 'G-G3K8FJ9N8S',
    });
  });

  it('ignores unknown products and works when analytics is blocked', () => {
    visit('/item/999999');
    expect(send.mock.calls.some(call => call[1] === 'view_item')).toBe(false);
    analyticsWindow.gtag = undefined;
    expect(() => visit('/item/51')).not.toThrow();
    analyticsWindow.gtag = vi.fn(() => { throw new Error('blocked'); });
    expect(() => service.checkoutFailure('invalid_form', 'address')).not.toThrow();
  });
});

