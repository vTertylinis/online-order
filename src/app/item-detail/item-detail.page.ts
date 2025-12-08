import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonSearchbar,
  IonCheckbox,
  IonTextarea,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import {
  MenuItem,
  menuItems,
  ingredients as DEFAULT_INGREDIENTS,
  sweetIngredients as DEFAULT_SWEET_INGREDIENTS,
} from '../models/menu-item.model';
import { translate as translateUtil } from '../models/translate.util';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  templateUrl: 'item-detail.page.html',
  styleUrls: ['item-detail.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonCard,
    CommonModule,
    CurrencyPipe,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonCheckbox,
    IonRadioGroup,
    IonRadio,
    FormsModule,
    IonListHeader,
    IonTextarea,
    IonButton,
    IonSpinner,
  ],
})
export class ItemDetailPage {
  id: string | null = null;
  item: MenuItem | null = null;
  imageLoading: boolean = true;
  sweetness: string = 'Σκέτο';
  size: string = 'Μονό';
  showSizeOptions: boolean = false;
  comments: string = '';
  ingredients: Array<{ name: string; price: number; selected?: boolean }> =
    DEFAULT_INGREDIENTS.map((i) => ({ name: i.name, price: i.price }));
  searchTerm: string = '';
  filteredIngredients: Array<{
    name: string;
    price: number;
    selected?: boolean;
  }> = this.ingredients.slice();

  showSavoryExtras: boolean = false;
  showSweetExtras: boolean = false;
  sweetIngredients: Array<{ name: string; price: number; selected?: boolean }> =
    DEFAULT_SWEET_INGREDIENTS.map((i) => ({ name: i.name, price: i.price }));
  sweetSearchTerm: string = '';
  filteredSweetIngredients: Array<{
    name: string;
    price: number;
    selected?: boolean;
  }> = this.sweetIngredients.slice();
  lang: string = 'gr';

  // Soft drinks selection for ID 200 and 202
  showSoftDrinks: boolean = false;
  softDrinks: Array<{ id: number; name: string; quantity?: number }> = [];
  REQUIRED_SOFT_DRINKS_COUNT = 2;

  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    // Try to read the full item from navigation state (set by HomePage.openItem).
    const state =
      (window && (window.history as any) && (window.history as any).state) ||
      null;
    const stateItem =
      state && (state as any).item ? ((state as any).item as MenuItem) : null;

    if (stateItem) {
      this.item = stateItem;
      if (!this.id && stateItem.id) this.id = String(stateItem.id);
    }
    if (this.id) {
      // Fallback: try to lookup the item by id from the local menu list.
      const idNum = Number(this.id);
      this.item = menuItems.find((m) => m.id === idNum) ?? null;
      // show size selection only for specific item ids
      const sizeApplicableIds = [3, 4, 5, 6, 13];
      if (sizeApplicableIds.includes(idNum)) {
        this.showSizeOptions = true;
        this.size = 'Μονό';
      }
    }
    // determine which extras lists should be visible based on item id
    const idCandidate = this.id
      ? Number(this.id)
      : this.item && (this.item as any).id
      ? Number((this.item as any).id)
      : NaN;
    const savoryIds = [51, 52, 101];
    const sweetIds = [53, 106];
    this.showSavoryExtras = savoryIds.includes(idCandidate);
    this.showSweetExtras = sweetIds.includes(idCandidate);
    this.showSoftDrinks = idCandidate === 200 || idCandidate === 202;

    // Initialize soft drinks list for ID 200 and 202
    if (this.showSoftDrinks) {
      // Set required count based on item ID
      this.REQUIRED_SOFT_DRINKS_COUNT = idCandidate === 200 ? 2 : 1;
      
      const softDrinkIds = [15, 16, 17, 18, 19, 20, 21, 22, 24, 31];
      this.softDrinks = softDrinkIds
        .map((id) => {
          const item = menuItems.find((m) => m.id === id);
          return item ? { id: item.id!, name: item.name, quantity: 0 } : null;
        })
        .filter((item) => item !== null) as Array<{
        id: number;
        name: string;
        quantity?: number;
      }>;
    }

    // initialize filtered lists
    this.filterIngredients();
    this.filterSweetIngredients();
  }

  // Called by Ionic each time the page is about to be presented.
  ionViewWillEnter() {
    // reset ingredient lists
    this.resetIngredients();
    this.resetSweetIngredients();
    this.resetSoftDrinks();
    // reset sweetness/size/comments so previous selections do not persist
    this.sweetness = 'Σκέτο';
    this.size = 'Μονό';
    this.comments = '';
    // refresh filtered lists after resets
    this.filterIngredients();
    this.filterSweetIngredients();
  }

  private resetIngredients() {
    this.searchTerm = '';
    this.ingredients = DEFAULT_INGREDIENTS.map((i) => ({
      name: i.name,
      price: i.price,
      selected: false,
    }));
    this.filteredIngredients = this.ingredients.slice();
  }

  private resetSweetIngredients() {
    this.sweetSearchTerm = '';
    this.sweetIngredients = DEFAULT_SWEET_INGREDIENTS.map((i) => ({
      name: i.name,
      price: i.price,
      selected: false,
    }));
    this.filteredSweetIngredients = this.sweetIngredients.slice();
  }

  private resetSoftDrinks() {
    if (this.softDrinks.length > 0) {
      this.softDrinks.forEach((drink) => (drink.quantity = 0));
    }
  }

  translate(key: string): string {
    return translateUtil(key, this.lang);
  }

  get totalPrice(): number {
    let base = this.item?.price || 0;
    // If the user selected the double size, add 0.5 to the base price
    if (this.size === 'Διπλό') {
      base += 0.5;
    }
    return base + this.extrasTotal + this.sweetExtrasTotal;
  }

  onSweetnessChange(event: any) {
    const newVal = event?.detail?.value ?? event;
    this.sweetness = newVal;
    console.log('sweetness changed ->', this.sweetness);
  }

  onSizeChange(event: any) {
    const newVal = event?.detail?.value ?? event;
    this.size = newVal;
    console.log('size changed ->', this.size);
  }

  selectSize(value: string) {
    this.size = value;
    console.log('selectSize ->', value);
  }

  selectSweetness(value: string) {
    this.sweetness = value;
    console.log('selectSweetness ->', value);
  }

  addToCart() {
    if (!this.item) return;

    // Validation for ID 200: require exactly 2 soft drinks
    if (this.showSoftDrinks) {
      const selectedCount = this.selectedSoftDrinksCount;
      if (selectedCount !== this.REQUIRED_SOFT_DRINKS_COUNT) {
        alert(
          `Παρακαλώ επιλέξτε ακριβώς ${this.REQUIRED_SOFT_DRINKS_COUNT} αναψυκτικά. Έχετε επιλέξει: ${selectedCount}`
        );
        return;
      }
    }

    const selectedSavory = this.ingredients
      .filter((i) => i.selected)
      .map((i) => ({ name: i.name, price: i.price }));
    const selectedSweet = this.sweetIngredients
      .filter((i) => i.selected)
      .map((i) => ({ name: i.name, price: i.price }));
    const selectedSoftDrinks: Array<{ name: string; price: number }> = [];
    this.softDrinks.forEach((d) => {
      const qty = d.quantity || 0;
      for (let i = 0; i < qty; i++) {
        selectedSoftDrinks.push({ name: this.translate(d.name), price: 0 });
      }
    });
    const allExtras = [...selectedSavory, ...selectedSweet, ...selectedSoftDrinks];
    // Compute basePrice including size surcharge for double
    const basePrice = (this.item.price || 0) + (this.size === 'Διπλό' ? 0.5 : 0);
    const cartItem = {
      id: this.item.id,
      name: this.translate(this.item.name) || this.item.name,
      basePrice: basePrice,
      sweetness: this.item.category === 'COFFEES' ? this.sweetness : undefined,
      size: this.item.category === 'COFFEES' ? this.size : undefined,
      ingredients: allExtras,
      comments: this.comments,
      quantity: 1,
    };
    this.cart.add(cartItem);
    // navigate to cart to show the added item
    this.router.navigate(['/home']);
  }

  filterIngredients() {
    const q = (this.searchTerm || '').trim();
    const nq = this.normalizeText(q);
    if (!nq) {
      this.filteredIngredients = this.ingredients.slice();
    } else {
      this.filteredIngredients = this.ingredients.filter((i) => {
        const name = i.name || '';
        return this.normalizeText(name).includes(nq);
      });
    }
  }

  // Normalize text by removing diacritics (tonos), converting final sigma to regular sigma,
  // trimming and converting to lowercase for accent-insensitive comparisons.
  private normalizeText(s: string): string {
    if (!s) return '';
    try {
      // NFD separates base characters and diacritics; remove combining marks via Unicode property
      return s
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .replace(/ς/g, 'σ')
        .trim()
        .toLowerCase();
    } catch (e) {
      // Fallback if normalize or unicode regex isn't supported in the environment
      return s.replace(/ς/g, 'σ').trim().toLowerCase();
    }
  }

  onSelectionChange(ingredient: {
    name: string;
    price: number;
    selected?: boolean;
  }) {
    ingredient.selected = !!ingredient.selected;
    console.log(
      'ingredient selection changed ->',
      ingredient.name,
      ingredient.selected
    );
  }

  onSweetSelectionChange(ingredient: {
    name: string;
    price: number;
    selected?: boolean;
  }) {
    ingredient.selected = !!ingredient.selected;
    console.log(
      'sweet ingredient selection changed ->',
      ingredient.name,
      ingredient.selected
    );
  }

  filterSweetIngredients() {
    const q = (this.sweetSearchTerm || '').trim();
    const nq = this.normalizeText(q);
    if (!nq) {
      this.filteredSweetIngredients = this.sweetIngredients.slice();
    } else {
      this.filteredSweetIngredients = this.sweetIngredients.filter((i) =>
        this.normalizeText(i.name || '').includes(nq)
      );
    }
  }

  get sweetExtrasTotal(): number {
    return this.sweetIngredients
      .filter((i) => i.selected)
      .reduce((s, i) => s + (i.price || 0), 0);
  }

  get extrasTotal(): number {
    return this.ingredients
      .filter((i) => i.selected)
      .reduce((s, i) => s + (i.price || 0), 0);
  }

  get selectedSoftDrinksCount(): number {
    return this.softDrinks.reduce((sum, d) => sum + (d.quantity || 0), 0);
  }

  get canAddToCart(): boolean {
    if (this.showSoftDrinks) {
      return this.selectedSoftDrinksCount === this.REQUIRED_SOFT_DRINKS_COUNT;
    }
    return true;
  }

  onSoftDrinkSelectionChange(drink: {
    id: number;
    name: string;
    quantity?: number;
  }) {
    // no-op placeholder for checkbox legacy; kept for compatibility
  }

  changeSoftDrink(drink: { id: number; name: string; quantity?: number }, delta: number) {
    const currentQty = drink.quantity || 0;
    const newQty = currentQty + delta;
    if (newQty < 0) return;

    const totalWithoutCurrent = this.selectedSoftDrinksCount - currentQty;
    if (totalWithoutCurrent + newQty > this.REQUIRED_SOFT_DRINKS_COUNT) return;

    drink.quantity = newQty;
    console.log('soft drink quantity changed ->', drink.name, drink.quantity);
  }
}
