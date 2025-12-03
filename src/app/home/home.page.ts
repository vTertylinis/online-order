import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
  AlertController,
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
export class HomePage implements OnInit, AfterViewInit {
  // default language for translations; change to 'gr' for Greek
  lang = 'gr';
  menuItems: MenuItem[] = menuItems;

  categories: Category[] = [];

  selectedCategoryIndex = 0;
  @ViewChild(IonContent) content!: IonContent;
  private categoryTops: number[] = [];
  private headerOffset = 0;
  private scrollLockUntil = 0; // timestamp until which we ignore scroll-driven chip updates
  private scrollRaf = 0;
  private lastScrollTop = 0;

  async scrollToCategory(index: number) {
    await this.computeCategoryPositions();
    const y = this.categoryTops[index] || 0;
    const target = Math.max(0, y - (this.headerOffset || 0));
    this.selectedCategoryIndex = index; // lock visual selection immediately
    this.ensureChipVisible(index);
    // lock scroll-driven updates during programmatic smooth scrolll
    this.scrollLockUntil = Date.now() + 700; // duration + buffer
    try {
      await this.content.scrollToPoint(0, target, 500);
    } finally {
      // release lock shortly after animation completes
      setTimeout(() => {
        if (Date.now() >= this.scrollLockUntil) this.scrollLockUntil = 0;
      }, 50);
    }
  }

  constructor(
    private router: Router, 
    private cartService: CartService,
    private alertController: AlertController
  ) {
    // Ensure the cart icon is registered for IonIcon usage
    addIcons({ cart });
  }

  ngOnInit(): void {
    this.buildCategories();
    this.checkDeliveryHours();
  }

  private async checkDeliveryHours() {
    // Get current time in Greek timezone (Europe/Athens)
    const greekTime = new Date().toLocaleString('en-US', { 
      timeZone: 'Europe/Athens',
      hour12: false 
    });
    const greekDate = new Date(greekTime);
    const hour = greekDate.getHours();

    // Delivery hours: 9 AM (09:00) to 12 AM (00:00, midnight - end of day)
    // Valid hours: 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
    // Invalid hours: 0, 1, 2, 3, 4, 5, 6, 7, 8
    const isWithinDeliveryHours = hour >= 9 && hour <= 23;

    if (!isWithinDeliveryHours) {
      const alert = await this.alertController.create({
        header: 'Εκτός Ωραρίου Παράδοσης',
        message: 'Οι παραδόσεις γίνονται από τις 09:00 το πρωί έως τα μεσάνυχτα (00:00). Παρακαλούμε επισκεφθείτε μας ξανά κατά τις ώρες λειτουργίας μας.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  async ngAfterViewInit() {
    await this.computeCategoryPositions();
    setTimeout(() => this.computeCategoryPositions(), 300);
  }

  @HostListener('window:resize')
  onResize() {
    this.computeCategoryPositions();
  }

  async onContentScroll(ev: CustomEvent) {
    if (Date.now() < this.scrollLockUntil) return; // ignore during programmatic scroll
    const detail: any = (ev as any).detail || {};
    this.lastScrollTop = detail.scrollTop || 0;
    if (!this.scrollRaf) {
      this.scrollRaf = requestAnimationFrame(async () => {
        this.scrollRaf = 0;
        if (!this.categoryTops.length) {
          await this.computeCategoryPositions();
        }
        this.handleScrollPosition(this.lastScrollTop);
      });
    }
  }

  private handleScrollPosition(scrollTop: number) {
    const y = scrollTop + (this.headerOffset || 0) + 1;
    let idx = 0;
    for (let i = 0; i < this.categoryTops.length; i++) {
      if (this.categoryTops[i] <= y) idx = i; else break;
    }
    if (this.selectedCategoryIndex !== idx) {
      this.selectedCategoryIndex = idx;
      this.ensureChipVisible(idx, true);
    }
  }

  private getFixedTopHeight(): number {
    const header = document.querySelector('.store-header') as HTMLElement | null;
    const chips = document.querySelector('.chip-bar-wrapper') as HTMLElement | null;
    const root = document.documentElement;
    const safeStr = getComputedStyle(root).getPropertyValue('--ion-safe-area-top').trim();
    const safe = parseInt(safeStr || '0', 10) || 0;
    return (header?.offsetHeight || 0) + (chips?.offsetHeight || 0) + safe;
  }

  private async computeCategoryPositions() {
    try {
      const scrollEl = await this.content.getScrollElement();
      const rootRect = scrollEl.getBoundingClientRect();
      const tops: number[] = [];
      for (let i = 0; i < this.categories.length; i++) {
        const el = document.getElementById('cat-' + i);
        if (el) {
          const r = el.getBoundingClientRect();
          const top = r.top - rootRect.top + scrollEl.scrollTop;
          tops.push(top);
        } else {
          tops.push(0);
        }
      }
      this.categoryTops = tops;
      this.headerOffset = this.getFixedTopHeight();
    } catch {
      this.categoryTops = [];
      this.headerOffset = 0;
    }
  }

  private ensureChipVisible(index: number, smooth = false) {
    const bar = document.querySelector('.chip-bar') as HTMLElement | null;
    if (!bar) return;
    const chips = Array.from(bar.querySelectorAll('ion-chip')) as HTMLElement[];
    const chip = chips[index];
    if (!chip) return;
    try {
      chip.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
    } catch {
      // no-op if not supported
    }
  }

  private buildCategories() {
    const map = new Map<string, MenuItem[]>();
    const lookup = (k?: string) => {
      if (!k) return null;
      if ((translations as any)[k] && (translations as any)[k][this.lang]) return (translations as any)[k][this.lang];
      const ku = (k || '').toUpperCase();
      if ((translations as any)[ku] && (translations as any)[ku][this.lang]) return (translations as any)[ku][this.lang];
      return null;
    };

    for (const it of this.menuItems) {
      const key = it.category || 'UNCATEGORIZED';
      if (!map.has(key)) map.set(key, []);
      const copy: MenuItem = { ...it, desc: it.desc ?? it.description };

      const nameTranslated = lookup(it.name as string) || lookup((it.name || '').toString().toUpperCase());
      if (nameTranslated) copy.name = nameTranslated as any;

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
        if (v) { descTranslated = v as any; break; }
      }
      if (descTranslated) copy.desc = descTranslated as any;

      map.get(key)!.push(copy);
    }

    const result: Category[] = [];
    for (const [key, items] of map) {
      const translatedCategory = lookup(key);
      const pretty = translatedCategory
        ? (translatedCategory as any)
        : key.toLowerCase().replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
      result.push({ name: pretty as any, items });
    }
    this.categories = result;
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
