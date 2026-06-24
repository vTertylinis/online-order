import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from './cart.service';
import { menuItems, getPrinterForCategory } from '../models/menu-item.model';
import { environment } from 'src/environments/environment';
import elMenu from '../../assets/i18n/el/menu.json';
import elItemDetail from '../../assets/i18n/el/item-detail.json';

/** Shape expected by POST /cart/:tableId on the backend. */
interface BackendCartItem {
  name: string;
  price: number;
  coffeePreference?: string;
  coffeeSize?: string;
  extras: Array<{ name: string; price: number }>;
  comments?: string;
  printer: string;
  /** PDA app reads these to decide whether to show the extras checkboxes section */
  category?: string;
  materials?: boolean;
  materialsSweet?: boolean;
}

/** Maps our internal category keys to the PDA app's Greek category names */
const CATEGORY_GREEK_NAME: Record<string, string> = {
  TOASTS_CREPS:    'Τοστ - Κρέπες',
  COFFEES:         'Καφέδες',
  SOFT_DRINKS:     'Αναψυκτικά',
  JUICES:          'Χυμοί κουτί',
  BEERS:           'Μπύρες',
  DRINKS_WINES:    'Ποτά - Κρασιά',
  Cocktails:       'Cocktails',
  BREAKFAST:       'Πρωινό',
  CLUB_SANDWICH:   'Κλαμπ σάντουιτς',
  JUNIOR_MENU:     'Junior Menu',
  PINSA:           'Pinsa',
  PASTA:           'Pasta',
  HOTDOG_BURGERS:  'Hotdog - Burgers',
  BAO_BUNS:        'Bao Buns',
  SALADS:          'Σαλάτες',
  SIDES:           'Κυρίως πιάτα',
  MAIN_COURSES:    'Κυρίως πιάτα',
};

@Injectable({ providedIn: 'root' })
export class DineInOrderService {
  private readonly base = environment.backendUrl;

  constructor(private http: HttpClient, private cartService: CartService) {}

  /**
   * Submits the current dine-in cart to the backend:
   * 1. POST each item (expanded by quantity) to /cart/:tableId
   * 2. POST /print-unprinted/:tableId to trigger printing
   */
  async submitOrder(tableId: string): Promise<void> {
    const items = this.cartService.getItems();
    if (!items.length) return;

    // POST each item individually, expanding quantity
    for (const item of items) {
      const backendItem = this.toBackendItem(item);
      const qty = item.quantity || 1;
      for (let i = 0; i < qty; i++) {
        await this.http
          .post(`${this.base}/cart/${encodeURIComponent(tableId)}`, backendItem)
          .toPromise();
      }
    }

    // Trigger printing of all unprinted items
    // source:'dinein' tells the backend to label the printout as "SELF-ORDER"
    await this.http
      .post(`${this.base}/print-unprinted/${encodeURIComponent(tableId)}`, { source: 'dinein' })
      .toPromise();
  }

  // ── Private helpers ──────────────────────────────────────────

  private toBackendItem(item: CartItem): BackendCartItem {
    const menuEntry = menuItems.find((m) => m.id === item.id);
    const category = menuEntry?.category;
    const printer = getPrinterForCategory(category);

    const extrasCost = (item.ingredients || []).reduce(
      (s, e) => s + (e.price || 0),
      0
    );
    const unitPrice = (item.basePrice || 0) + extrasCost;

    const hasSweetIngredients = (item.ingredients || []).some((ing) =>
      ing.name.startsWith('SWE_')
    );
    const hasSavoryIngredients = (item.ingredients || []).some((ing) =>
      ing.name.startsWith('ING_')
    );

    return {
      name: this.toGreekName('menu.' + item.name),
      price: unitPrice,
      coffeePreference: item.sweetness
        ? this.toGreekName('item-detail.SWEETNESS.' + item.sweetness)
        : undefined,
      // The PDA app stores/edits coffee size as the canonical token 'single'/'double'
      // (its edit modal binds radios to and runs price math against these literals,
      // and the print server outputs the value verbatim). Sending the localized
      // string ("Μονό"/"Διπλό") instead breaks the waiter's Edit flow, so normalize
      // our internal 'SINGLE'/'DOUBLE' to the lowercase token the PDA app expects.
      coffeeSize: item.size ? item.size.toLowerCase() : undefined,
      extras: (item.ingredients || []).map((ing) => ({
        name: this.toGreekName('menu.' + ing.name),
        price: ing.price,
      })),
      comments: item.comments || undefined,
      printer,
      category: category ? (CATEGORY_GREEK_NAME[category] ?? category) : undefined,
      materials: hasSavoryIngredients ? true : undefined,
      materialsSweet: hasSweetIngredients ? true : undefined,
    };
  }

  /** Resolves a namespaced key against the bundled Greek translation files.
   *  If the key is not found in the translations (e.g. item name is already
   *  a plain display name like "Cappuccino"), returns the name as-is. */
  private toGreekName(namespacedKey: string): string {
    const dotIdx = namespacedKey.indexOf('.');
    if (dotIdx === -1) return namespacedKey;
    const ns = namespacedKey.slice(0, dotIdx);
    const rest = namespacedKey.slice(dotIdx + 1);
    const source: Record<string, unknown> =
      ns === 'menu'
        ? (elMenu as Record<string, unknown>)
        : ns === 'item-detail'
        ? (elItemDetail as Record<string, unknown>)
        : {};
    const parts = rest.split('.');
    let val: unknown = source;
    for (const part of parts) {
      if (val && typeof val === 'object')
        val = (val as Record<string, unknown>)[part];
      else return rest; // key not found — return the bare name, not "menu.Name"
    }
    return typeof val === 'string' ? val : rest;
  }
}
