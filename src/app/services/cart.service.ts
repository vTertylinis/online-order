import { Injectable } from '@angular/core';
import { ModeService } from './mode.service';

export interface CartItem {
  id?: number;
  name: string;
  basePrice: number;
  sweetness?: string;
  size?: string;
  ingredients?: Array<{ name: string; price: number }>;
  comments?: string;
  quantity?: number;
}

const DELIVERY_KEY = 'online-order-cart-v1';  // unchanged — existing customers keep their cart
const DINEIN_KEY   = 'dinein-cart-v1';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private deliveryItems: CartItem[] = [];
  private dineinItems: CartItem[]   = [];

  constructor(private modeService: ModeService) {
    this.deliveryItems = this.readStorage(DELIVERY_KEY);
    this.dineinItems   = this.readStorage(DINEIN_KEY);
  }

  // ── Private helpers ──────────────────────────────────────────────────

  private get activeItems(): CartItem[] {
    return this.modeService.isDineIn ? this.dineinItems : this.deliveryItems;
  }

  private get activeKey(): string {
    return this.modeService.isDineIn ? DINEIN_KEY : DELIVERY_KEY;
  }

  private readStorage(key: string): CartItem[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) || [] : [];
    } catch {
      return [];
    }
  }

  private save() {
    try {
      localStorage.setItem(this.activeKey, JSON.stringify(this.activeItems));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }

  // ── Public API (identical signatures — no callers need to change) ────

  getItems(): CartItem[] {
    return this.activeItems.slice();
  }

  add(item: CartItem) {
    const list = this.activeItems;
    const matchIndex = list.findIndex((it) =>
      it.id === item.id &&
      it.sweetness === item.sweetness &&
      it.size === item.size &&
      JSON.stringify(it.ingredients || []) === JSON.stringify(item.ingredients || []) &&
      (it.comments || '') === (item.comments || '')
    );

    if (matchIndex >= 0) {
      list[matchIndex].quantity = (list[matchIndex].quantity || 1) + (item.quantity || 1);
    } else {
      list.push({ ...item, quantity: item.quantity || 1 });
    }
    this.save();
  }

  remove(index: number) {
    const list = this.activeItems;
    if (index >= 0 && index < list.length) {
      list.splice(index, 1);
      this.save();
    }
  }

  clear() {
    if (this.modeService.isDineIn) {
      this.dineinItems = [];
    } else {
      this.deliveryItems = [];
    }
    this.save();
  }

  getTotal(): number {
    return this.activeItems.reduce((sum, it) => {
      const extras = (it.ingredients || []).reduce((s, e) => s + (e.price || 0), 0);
      const price  = (it.basePrice || 0) + extras;
      return sum + price * (it.quantity || 1);
    }, 0);
  }
}
