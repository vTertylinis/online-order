import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { cart } from 'ionicons/icons';
import { CartService } from '../services/cart.service';
// @ts-ignore - allow importing JSON translation file (project may enable resolveJsonModule)
import translations from '../../assets/i18n/translations.json';
import { MenuItem, menuItems } from '../models/menu-item.model';

interface Category {
  name: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonChip,
    IonFab,
    IonFabButton,
    IonIcon,
    CommonModule,
    CurrencyPipe,
    RouterLink,
  ],
})
export class HomePage {
  // default language for translations; change to 'gr' for Greek
  lang = 'gr';
  menuItems: MenuItem[] = menuItems;

  // Group menuItems by category for the template. The template expects `categories`.
  get categories(): Category[] {
    const map = new Map<string, MenuItem[]>();
    const lookup = (k?: string) => {
      if (!k) return null;
      if (translations[k] && translations[k][this.lang]) return translations[k][this.lang];
      const ku = k.toUpperCase();
      if (translations[ku] && translations[ku][this.lang]) return translations[ku][this.lang];
      return null;
    };

    for (const it of this.menuItems) {
      const key = it.category || 'UNCATEGORIZED';
      if (!map.has(key)) map.set(key, []);
      const copy: MenuItem = { ...it, desc: it.desc ?? it.description };

      // Translate item name if available
      const nameTranslated = lookup(it.name as string) || lookup((it.name || '').toString().toUpperCase());
      if (nameTranslated) copy.name = nameTranslated;

      // Translate description: try explicit description key, then common patterns
      const descCandidates = [
        it.description,
        it.description && it.description.toString().toUpperCase(),
        (it.name || '') + '_DESC',
        (it.name || '').toUpperCase() + '_DESC',
        (it.name || '') + 'Desc',
        (it.name || '') + 'desc',
      ];
      let descTranslated: string | null = null;
      for (const c of descCandidates) {
        const v = lookup(c as string);
        if (v) {
          descTranslated = v;
          break;
        }
      }
      if (descTranslated) copy.desc = descTranslated;

      map.get(key)!.push(copy);
    }

    // convert to array with nicer category names (use translations when present)
    const result: Category[] = [];
    for (const [key, items] of map) {
      const translatedCategory = lookup(key);
      const pretty = translatedCategory
        ? translatedCategory
        : key
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
      result.push({ name: pretty, items });
    }
    return result;
  }

  selectedCategoryIndex = 0;

  scrollToCategory(index: number) {
    const id = 'cat-' + index;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.selectedCategoryIndex = index;
    }
  }

  constructor(private router: Router, private cartService: CartService) {
    // Ensure the cart icon is registered for IonIcon usage
    addIcons({ cart });
  }

  get cartCount(): number {
    try {
      const items = this.cartService.getItems();
      return items.reduce((sum, it: any) => sum + (it.quantity || 1), 0);
    } catch {
      return 0;
    }
  }

  addToOrder(item: MenuItem) {
    // Placeholder action: integrate with cart or order flow later
    // For now, log to console so developers can verify interaction
    console.log('Add to order:', item);
  }

  openItem(item: MenuItem) {
    const id = item?.id ?? null;
    if (id !== null && id !== undefined) {
      // Pass the full item in navigation state while keeping the existing id route.
      this.router.navigate(['/item', id], { state: { item } });
    } else {
      console.warn('Item has no id, cannot open detail view', item);
    }
  }
}
