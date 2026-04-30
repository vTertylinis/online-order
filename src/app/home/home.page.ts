import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  AlertController,
} from '@ionic/angular/standalone';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { cart, add, restaurantOutline, fastFoodOutline, pizzaOutline, cafeOutline, beerOutline, wineOutline, leafOutline, nutritionOutline, sunnyOutline, happyOutline, waterOutline, giftOutline, globeOutline, chevronDown, starOutline } from 'ionicons/icons';
import { CartService } from '../services/cart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem, menuItems, POPULAR_ITEMS } from '../models/menu-item.model';
import { isWithinDeliveryHours } from '../utils/delivery-hours.util';
import { LazyImageDirective } from '../utils/lazy-image.directive';
import { Subscription } from 'rxjs';

const CATEGORY_ICONS: Record<string, string> = {
  POPULAR:        'star-outline',
  TOASTS_CREPS:   'restaurant-outline',
  HOTDOG_BURGERS: 'fast-food-outline',
  BAO_BUNS:       'restaurant-outline',
  MAIN_COURSES:   'restaurant-outline',
  CLUB_SANDWICH:  'restaurant-outline',
  JUNIOR_MENU:    'happy-outline',
  PINSA:          'pizza-outline',
  PASTA:          'restaurant-outline',
  SALADS:         'leaf-outline',
  BREAKFAST:      'sunny-outline',
  LENT_MENU:      'leaf-outline',
  COFFEES:        'cafe-outline',
  SOFT_DRINKS:    'water-outline',
  JUICES:         'nutrition-outline',
  BEERS:          'beer-outline',
  DRINKS_WINES:   'wine-outline',
  Cocktails:      'wine-outline',
  COMBO_OFFERS:   'gift-outline',
};

interface Category {
  name: string;
  icon: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonChip,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLabel,
    CommonModule,
    CurrencyPipe,
    RouterLink,
    LazyImageDirective,
    TranslateModule,
  ],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  menuItems: MenuItem[] = menuItems;

  categories: Category[] = [];

  // Language selector
  languages = [
    { code: 'el', flag: 'assets/flags/gr.png', label: 'Ελληνικά' },
    { code: 'en', flag: 'assets/flags/en.png', label: 'English' },
    { code: 'sr', flag: 'assets/flags/sr.png', label: 'Српски' },
    { code: 'bg', flag: 'assets/flags/bg.png', label: 'Български' },
  ];
  currentLang = 'el';
  langMenuOpen = false;

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

  private langSub!: Subscription;

  constructor(
    private router: Router, 
    private cartService: CartService,
    private alertController: AlertController,
    private translateService: TranslateService
  ) {
    addIcons({ cart, add, restaurantOutline, fastFoodOutline, pizzaOutline, cafeOutline, beerOutline, wineOutline, leafOutline, nutritionOutline, sunnyOutline, happyOutline, waterOutline, giftOutline, globeOutline, chevronDown, starOutline });
    this.currentLang = this.translateService.currentLang || this.translateService.defaultLang || 'el';
  }

  ngOnInit(): void {
    this.buildCategories();
    this.checkDeliveryHours();
    this.langSub = this.translateService.onLangChange.subscribe(() => {
      this.currentLang = this.translateService.currentLang;
      this.buildCategories();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  get currentFlagSrc(): string {
    return this.languages.find(l => l.code === this.currentLang)?.flag || 'assets/flags/gr.png';
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  switchLang(code: string) {
    this.langMenuOpen = false;
    if (code === this.currentLang) return;
    localStorage.setItem('app-lang', code);
    this.translateService.use(code);
  }

  private async checkDeliveryHours() {
    if (!isWithinDeliveryHours()) {
      const alert = await this.alertController.create({
        header: this.translateService.instant('common.DELIVERY_HOURS.TITLE'),
        message: this.translateService.instant('common.DELIVERY_HOURS.MESSAGE'),
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
      const result = this.translateService.instant('menu.' + k);
      if (result !== 'menu.' + k) return result;
      const ku = (k || '').toUpperCase();
      const resultU = this.translateService.instant('menu.' + ku);
      if (resultU !== 'menu.' + ku) return resultU;
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
    
    // Add POPULAR first
    const popularTranslated = lookup('POPULAR');
    const popularName = popularTranslated || 'Popular';
    result.push({ name: popularName as any, icon: CATEGORY_ICONS['POPULAR'], items: POPULAR_ITEMS.map(it => {
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
      return copy;
    }) });

    // Add COMBO_OFFERS second if it exists
    if (map.has('COMBO_OFFERS')) {
      const translatedCategory = lookup('COMBO_OFFERS');
      const pretty = translatedCategory || 'Combo Offers';
      result.push({ name: pretty as any, icon: CATEGORY_ICONS['COMBO_OFFERS'] ?? 'restaurant-outline', items: map.get('COMBO_OFFERS')! });
      map.delete('COMBO_OFFERS');
    }
    
    // Add remaining categories
    for (const [key, items] of map) {
      const translatedCategory = lookup(key);
      const pretty = translatedCategory
        ? (translatedCategory as any)
        : key.toLowerCase().replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
      result.push({ name: pretty as any, icon: CATEGORY_ICONS[key] ?? 'restaurant-outline', items });
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
