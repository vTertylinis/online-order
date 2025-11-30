import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    const value = this.form.value;
    try {
      localStorage.setItem('checkout_address', JSON.stringify(value));
    } catch {}

    const toast = await this.toastCtrl.create({
      message: 'Η διεύθυνση αποθηκεύτηκε επιτυχώς!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.router.navigateByUrl('/');
  }
}
