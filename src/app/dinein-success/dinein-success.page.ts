import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, restaurantOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-dinein-success',
  standalone: true,
  imports: [IonContent, IonIcon, TranslateModule],
  templateUrl: './dinein-success.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./dinein-success.page.scss'],
})
export class DineInSuccessPage {
  private router = inject(Router);
  private tableService = inject(TableService);

  tableNumber: string | null;

  constructor() {
    addIcons({ checkmarkCircleOutline, restaurantOutline });
    this.tableNumber = this.tableService.tableNumber;
  }

  goToMenu(): void {
    this.router.navigate(['/dinein/home']);
  }
}
