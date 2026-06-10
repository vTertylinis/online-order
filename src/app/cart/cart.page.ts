import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  trashOutline,
  alertCircleOutline,
  bagHandleOutline,
  cubeOutline,
  chevronForward,
} from 'ionicons/icons';
import { CartService, CartItem } from '../services/cart.service';
import { ModeService } from '../services/mode.service';
import { TableService } from '../services/table.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonFooter, CommonModule, CurrencyPipe, RouterLink, TranslateModule],
})
export class CartPage {
  items: CartItem[] = [];
  readonly MINIMUM_ORDER = 6;

  constructor(
    private cart: CartService,
    private router: Router,
    private translateService: TranslateService,
    private modeService: ModeService,
    private tableService: TableService,
  ) {
    addIcons({
      cartOutline,
      trashOutline,
      alertCircleOutline,
      bagHandleOutline,
      cubeOutline,
      chevronForward,
    });
    this.refresh();
  }

  ionViewWillEnter() {
    // Re-read the cart every time the page becomes visible so both modes
    // always reflect the latest items without needing a full reload.
    this.refresh();
  }

  get isDineIn(): boolean {
    return this.modeService.isDineIn;
  }

  get homeRoute(): string {
    return this.modeService.isDineIn ? '/dinein/home' : '/home';
  }

  get tableNumber(): string | null {
    return this.tableService.tableNumber;
  }

  refresh() {
    this.items = this.cart.getItems();
  }

  remove(index: number) {
    this.cart.remove(index);
    this.refresh();
  }

  clear() {
    this.cart.clear();
    this.refresh();
  }

  get total(): number {
    return this.cart.getTotal();
  }

  get isMinimumMet(): boolean {
    // Dine-in orders have no minimum — guests are already at the table.
    if (this.modeService.isDineIn) return true;
    return this.total >= this.MINIMUM_ORDER;
  }

  get remainingForMinimum(): number {
    return Math.max(0, this.MINIMUM_ORDER - this.total);
  }

  checkout() {
    // placeholder: navigate to home or show a message in future
    alert('Checkout not implemented in this demo.');
  }

  // Translate item name using ngx-translate
  getItemName(name: string): string {
    const result = this.translateService.instant('menu.' + name);
    if (result !== 'menu.' + name) return result;
    const resultU = this.translateService.instant('menu.' + name.toUpperCase());
    if (resultU !== 'menu.' + name.toUpperCase()) return resultU;
    return name;
  }

  // Translate sweetness/size keys
  translateKey(key: string, prefix: string): string {
    const result = this.translateService.instant(prefix + '.' + key);
    return result !== prefix + '.' + key ? result : key;
  }

  // Return comma-separated ingredient names (safe for template bindings)
  ingredientsList(item: CartItem): string {
    if (!item || !item.ingredients || !item.ingredients.length) return '';
    return item.ingredients.map(i => this.getItemName(i.name)).join(', ');
  }

  // Compute item price including extras
  itemPrice(item: CartItem): number {
    if (!item) return 0;
    const extras = (item.ingredients || []).reduce((s, e) => s + (e.price || 0), 0);
    return (item.basePrice || 0) + extras;
  }
}
