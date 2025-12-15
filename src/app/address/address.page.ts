/// <reference types="google.maps" />

import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
  IonSegment,
  IonSegmentButton,
  ToastController,
  AlertController 
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { isWithinDeliveryHours } from '../utils/delivery-hours.util';

declare var google: any;

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
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
    IonButton,
    IonSegment,
    IonSegmentButton
  ],
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss']
})
export class AddressPage implements AfterViewInit {
  @ViewChild('mapElement', { static: false }) mapElement?: ElementRef;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  addressMode: 'manual' | 'map' = 'manual';
  map?: google.maps.Map;
  marker?: google.maps.Marker;
  selectedLocation?: { lat: number; lng: number };
  selectedAddress?: string;

  form = this.fb.group({
    address: ['', [Validators.required, Validators.minLength(3)]],
    floor: [''],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,14}$/)]]
  });

  ngAfterViewInit() {
    // Initialize map when map mode is selected
    if (this.addressMode === 'map') {
      this.initMap();
    }
  }

  onAddressModeChange() {
    if (this.addressMode === 'map') {
      // Initialize map after a short delay to ensure the element is rendered
      setTimeout(() => {
        this.initMap();
      }, 100);
      
      // Make address field optional when using map
      this.form.controls.address.clearValidators();
      this.form.controls.address.updateValueAndValidity();
    } else {
      // Make address field required when using manual input
      this.form.controls.address.setValidators([Validators.required, Validators.minLength(3)]);
      this.form.controls.address.updateValueAndValidity();
    }
  }

  initMap() {
    if (!this.mapElement || !this.mapElement.nativeElement) {
      return;
    }

    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps JavaScript API not loaded');
      return;
    }

    // Default center (Athens, Greece - you can change this to your preferred location)
    const defaultCenter = { lat: 40.3983, lng: 23.8775 };

    const mapOptions: google.maps.MapOptions = {
      center: defaultCenter,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
      }
    ]
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map?.setCenter(userLocation);
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }

    // Add click listener to place marker
    if (this.map) {
      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          this.placeMarker(event.latLng);
        }
      });
    }
  }

  placeMarker(location: google.maps.LatLng) {
    // Remove existing marker if any
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Create new marker
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true
    });

    // Update selected location
    this.selectedLocation = {
      lat: location.lat(),
      lng: location.lng()
    };

    // Add drag listener to update location when marker is dragged
    if (this.marker) {
      this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          this.selectedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.reverseGeocode(event.latLng);
        }
      });
    }

    // Reverse geocode to get address
    this.reverseGeocode(location);
  }

  reverseGeocode(location: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: location }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === 'OK' && results && results[0]) {
        this.selectedAddress = results[0].formatted_address;
        // Update the form address field with geocoded address
        this.form.patchValue({ address: this.selectedAddress });
      } else {
        this.selectedAddress = undefined;
        console.error('Geocoder failed:', status);
      }
    });
  }

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
    if (!isWithinDeliveryHours()) {
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

    // Prepare address data with location if map mode
    const finalAddressData = {
      ...addressData,
      ...(this.addressMode === 'map' && this.selectedLocation ? {
        location: this.selectedLocation,
        addressType: 'map'
      } : {
        addressType: 'manual'
      })
    };

    // Save to localStorage
    try {
      localStorage.setItem('checkout_address', JSON.stringify(finalAddressData));
    } catch {}

    // Send to ngrok server
    const orderData = {
      address: finalAddressData,
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
