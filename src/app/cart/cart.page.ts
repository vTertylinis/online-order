import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonButton, IonText, IonIcon } from '@ionic/angular/standalone';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonButton, IonText, IonIcon, CommonModule, CurrencyPipe, RouterLink],
})
export class CartPage {
  items: CartItem[] = [];
  readonly MINIMUM_ORDER = 6;

  constructor(private cart: CartService, private router: Router) {
    this.refresh();
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
    return this.total >= this.MINIMUM_ORDER;
  }

  get remainingForMinimum(): number {
    return Math.max(0, this.MINIMUM_ORDER - this.total);
  }

  checkout() {
    // placeholder: navigate to home or show a message in future
    alert('Checkout not implemented in this demo.');
  }

  // Return comma-separated ingredient names (safe for template bindings)
  ingredientsList(item: CartItem): string {
    if (!item || !item.ingredients || !item.ingredients.length) return '';
    return item.ingredients.map(i => i.name).join(', ');
  }

  // Compute item price including extras
  itemPrice(item: CartItem): number {
    if (!item) return 0;
    const extras = (item.ingredients || []).reduce((s, e) => s + (e.price || 0), 0);
    return (item.basePrice || 0) + extras;
  }
}
