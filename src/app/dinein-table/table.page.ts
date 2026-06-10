import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown, restaurantOutline, sendOutline } from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TableService } from '../services/table.service';
import { CartService } from '../services/cart.service';
import { DineInOrderService } from '../services/dinein-order.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    TranslateModule,
  ],
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit, OnDestroy {
  /** Currently selected table number (0 = nothing selected) */
  selectedTable = 0;
  submitted = false;
  submitting = false;

  /** Array [1 … 40] used by *ngFor in the template */
  readonly tableOptions = Array.from({ length: 40 }, (_, i) => i + 1);

  languages = [
    { code: 'el', flag: 'assets/flags/gr.png', label: 'Ελληνικά' },
    { code: 'en', flag: 'assets/flags/en.png', label: 'English' },
    { code: 'sr', flag: 'assets/flags/sr.png', label: 'Српски' },
    { code: 'bg', flag: 'assets/flags/bg.png', label: 'Български' },
    { code: 'ro', flag: 'assets/flags/ro.png', label: 'Română' },
  ];
  currentLang = 'el';
  langMenuOpen = false;
  private langSub!: Subscription;

  get currentFlagSrc(): string {
    return this.languages.find(l => l.code === this.currentLang)?.flag ?? 'assets/flags/gr.png';
  }

  toggleLangMenu() { this.langMenuOpen = !this.langMenuOpen; }

  switchLang(code: string) {
    this.langMenuOpen = false;
    if (code === this.currentLang) return;
    localStorage.setItem('app-lang', code);
    this.translateService.use(code);
  }

  constructor(
    private router: Router,
    private tableService: TableService,
    private cartService: CartService,
    private translateService: TranslateService,
    private dineInOrder: DineInOrderService,
  ) {
    addIcons({ chevronDown, restaurantOutline, sendOutline });
    this.currentLang = this.translateService.currentLang || this.translateService.defaultLang || 'el';
  }

  ngOnInit(): void {
    // Pre-select the previously used table if any.
    const saved = this.tableService.tableNumber;
    if (saved) this.selectedTable = Number(saved) || 0;

    this.langSub = this.translateService.onLangChange.subscribe(() => {
      this.currentLang = this.translateService.currentLang;
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  async confirm(): Promise<void> {
    this.submitted = true;
    if (!this.selectedTable || this.submitting) return;

    this.submitting = true;
    const tableId = String(this.selectedTable);
    this.tableService.setTable(tableId);

    try {
      await this.dineInOrder.submitOrder(tableId);
      this.cartService.clear();
      this.router.navigate(['/dinein/success']);
    } catch (err) {
      console.error('Dine-in order submission failed', err);
      this.submitting = false;
    }
  }
}

