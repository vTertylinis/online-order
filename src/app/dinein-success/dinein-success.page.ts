import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, restaurantOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { TableService } from '../services/table.service';

@Component({
  selector: 'app-dinein-success',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, TranslateModule],
  templateUrl: './dinein-success.page.html',
  styleUrls: ['./dinein-success.page.scss'],
})
export class DineInSuccessPage {
  tableNumber: string | null;

  constructor(private router: Router, private tableService: TableService) {
    addIcons({ checkmarkCircleOutline, restaurantOutline });
    this.tableNumber = this.tableService.tableNumber;
  }

  goToMenu(): void {
    this.router.navigate(['/dinein/home']);
  }
}
