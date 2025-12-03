import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonNote, 
  IonButton,
  ToastController,
  AlertController 
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonButton
  ],
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss']
})
export class AddressPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  form = this.fb.group({
    address: ['', [Validators.required, Validators.minLength(3)]],
    floor: [''],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,14}$/)]]
  });

  async submit() {
    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // Check delivery hours before submitting
    const greekTime = new Date().toLocaleString('en-US', { 
      timeZone: 'Europe/Athens',
      hour12: false 
    });
    const greekDate = new Date(greekTime);
    const hour = greekDate.getHours();

    // Delivery hours: 9 AM (09:00) to 12 AM (00:00, midnight - end of day)
    // Valid hours: 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
    const isWithinDeliveryHours = hour >= 9 && hour <= 23;

    if (!isWithinDeliveryHours) {
      const alert = await this.alertCtrl.create({
        header: 'Εκτός Ωραρίου Παράδοσης',
        message: 'Οι παραδόσεις γίνονται από τις 09:00 το πρωί έως τα μεσάνυχτα (00:00). Παρακαλούμε επισκεφθείτε μας ξανά κατά τις ώρες λειτουργίας μας.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const addressData = this.form.value;
    const cartItems = this.cartService.getItems();
    const total = this.cartService.getTotal();

    // Save to localStorage
    try {
      localStorage.setItem('checkout_address', JSON.stringify(addressData));
    } catch {}

    // Send to ngrok server
    const orderData = {
      address: addressData,
      cart: cartItems,
      total: total,
      timestamp: new Date().toISOString()
    };

    try {
      console.log('Sending order data:', orderData);
      
      const response = await this.http.post(
        'https://unepigrammatic-harshly-dario.ngrok-free.dev/order',
        orderData
      ).toPromise();
      
      console.log('Order sent successfully:', response);
      
      const alert = await this.alertCtrl.create({
        header: 'Επιτυχία',
        message: 'Λάβαμε με επιτυχία την παραγγελία σας και θα επικοινωνήσουμε μαζί σας για επιβεβαίωση.',
        buttons: ['OK']
      });
      await alert.present();
      await alert.onDidDismiss();
    } catch (error) {
      console.error('Error sending order:', error);
      
      const toast = await this.toastCtrl.create({
        message: 'Σφάλμα αποστολής παραγγελίας. Ελέγξτε τη σύνδεση.',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
      
      this.router.navigateByUrl('/');
      return;
    }

    this.router.navigateByUrl('/');
  }
}
