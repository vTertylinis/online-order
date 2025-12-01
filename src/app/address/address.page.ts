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
  ToastController 
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
      
      const toast = await this.toastCtrl.create({
        message: 'Η παραγγελία στάλθηκε επιτυχώς!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      console.error('Error sending order:', error);
      
      const toast = await this.toastCtrl.create({
        message: 'Σφάλμα αποστολής παραγγελίας. Ελέγξτε τη σύνδεση.',
        duration: 3000,
        color: 'warning'
      });
      await toast.present();
    }

    this.router.navigateByUrl('/');
  }
}
