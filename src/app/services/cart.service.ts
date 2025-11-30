import { Injectable } from '@angular/core';

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

const STORAGE_KEY = 'online-order-cart-v1';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.items = JSON.parse(raw) || [];
    } catch (e) {
      this.items = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items || []));
    } catch (e) {
      // ignore
    }
  }

  getItems(): CartItem[] {
    return this.items.slice();
  }

  add(item: CartItem) {
    // simple merge: if same item (id + same options) exists, increase quantity
    const matchIndex = this.items.findIndex((it) =>
      it.id === item.id &&
      it.sweetness === item.sweetness &&
      it.size === item.size &&
      JSON.stringify(it.ingredients || []) === JSON.stringify(item.ingredients || []) &&
      (it.comments || '') === (item.comments || '')
    );

    if (matchIndex >= 0) {
      this.items[matchIndex].quantity = (this.items[matchIndex].quantity || 1) + (item.quantity || 1);
    } else {
      this.items.push({ ...item, quantity: item.quantity || 1 });
    }
    this.save();
  }

  remove(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotal(): number {
    return this.items.reduce((sum, it) => {
      const extras = (it.ingredients || []).reduce((s, e) => s + (e.price || 0), 0);
      const price = (it.basePrice || 0) + extras;
      return sum + price * (it.quantity || 1);
    }, 0);
  }
}
