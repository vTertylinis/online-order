/// <reference types="google.maps" />

import { Component, inject, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone } from '@angular/core';
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
  IonInput,
  IonIcon,
  ToastController,
  AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline, mapOutline, locationOutline, checkmarkCircle,
  personOutline, callOutline, homeOutline, layersOutline, sendOutline
} from 'ionicons/icons';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { isWithinDeliveryHours } from '../utils/delivery-hours.util';
import { GoogleMapsLoaderService } from '../services/google-maps-loader.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import elMenu from '../../assets/i18n/el/menu.json';
import elItemDetail from '../../assets/i18n/el/item-detail.json';

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
    IonInput,
    IonIcon,
    TranslateModule,
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
  private mapsLoader = inject(GoogleMapsLoaderService);
  private translateService = inject(TranslateService);
  private ngZone = inject(NgZone);

  constructor() {
    addIcons({
      createOutline, mapOutline, locationOutline, checkmarkCircle,
      personOutline, callOutline, homeOutline, layersOutline, sendOutline
    });
  }

  addressMode: 'manual' | 'map' = 'manual';
  // Guards against double-submit: true while a POST /order is in flight.
  submitting = false;
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

  async ngAfterViewInit() {
    // Initialize map when map mode is selected
    if (this.addressMode === 'map') {
      await this.initMap();
    }
  }

  async onAddressModeChange() {
    if (this.addressMode === 'map') {
      // Initialize map after a short delay to ensure the element is rendered
      setTimeout(async () => {
        await this.initMap();
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

  async initMap() {
    if (!this.mapElement || !this.mapElement.nativeElement) {
      return;
    }

    try {
      await this.mapsLoader.load();
    } catch (e) {
      console.error('Google Maps JavaScript API failed to load', e);
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
          this.ngZone.run(() => this.placeMarker(event.latLng!));
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
          this.ngZone.run(() => {
            this.selectedLocation = {
              lat: event.latLng!.lat(),
              lng: event.latLng!.lng()
            };
            this.reverseGeocode(event.latLng!);
          });
        }
      });
    }

    // Reverse geocode to get address
    this.reverseGeocode(location);
  }

  reverseGeocode(location: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: location }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      this.ngZone.run(() => {
        if (status === 'OK' && results && results[0]) {
          this.selectedAddress = results[0].formatted_address;
          // Update the form address field with geocoded address
          this.form.patchValue({ address: this.selectedAddress });
        } else {
          this.selectedAddress = undefined;
          console.error('Geocoder failed:', status);
        }
      });
    });
  }

  async submit() {
    // Prevent duplicate orders from rapid taps / retries while a request is
    // still in flight (e.g. on a slow or stalled connection).
    if (this.submitting) return;

    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: this.translateService.instant('address.FORM_INVALID'),
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // Check if phone is a foreign (non-Greek) number
    const phoneValue = (this.form.value.phone ?? '').replace(/\s/g, '');
    const isGreekMobile = /^69/.test(phoneValue);
    if (!isGreekMobile) {
      const confirmed = await this.showIntlPhoneConfirmation();
      if (!confirmed) return;
    }

    // Check delivery hours before submitting
    if (!isWithinDeliveryHours()) {
      const alert = await this.alertCtrl.create({
        header: this.translateService.instant('common.DELIVERY_HOURS.TITLE'),
        message: this.translateService.instant('common.DELIVERY_HOURS.MESSAGE'),
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

    // Send to ngrok server — cart items are always translated to Greek.
    // orderId is a stable idempotency key for this cart so the server can dedupe
    // if the same order is sent more than once (e.g. a stalled connection that
    // later flushes several queued requests at once).
    const orderData = {
      orderId: this.cartService.getDeliveryOrderId(),
      address: finalAddressData,
      cart: this.toGreekCartItems(cartItems),
      total: total,
      timestamp: new Date().toISOString()
    };

    this.submitting = true;
    try {
      console.log('Sending order data:', orderData);

      const response = await this.http.post(
        'https://unepigrammatic-harshly-dario.ngrok-free.dev/order',
        orderData
      ).toPromise();

      console.log('Order sent successfully:', response);

      // Order went through — clear the cart (and its idempotency key) so it
      // can't be accidentally re-submitted.
      this.cartService.clear();

      const alert = await this.alertCtrl.create({
        header: this.translateService.instant('address.SUCCESS_TITLE'),
        message: this.translateService.instant('address.SUCCESS_MESSAGE'),
        buttons: ['OK']
      });
      await alert.present();
      await alert.onDidDismiss();

      this.router.navigateByUrl('/');
    } catch (error) {
      console.error('Error sending order:', error);

      const toast = await this.toastCtrl.create({
        message: this.translateService.instant('address.ERROR_SEND'),
        duration: 3000,
        color: 'warning'
      });
      await toast.present();

      this.router.navigateByUrl('/');
      return;
    } finally {
      this.submitting = false;
    }
  }

  private async showIntlPhoneConfirmation(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: this.translateService.instant('address.INTL_PHONE_TITLE'),
        message: this.translateService.instant('address.INTL_PHONE_MESSAGE'),
        buttons: [
          {
            text: this.translateService.instant('address.INTL_PHONE_CANCEL'),
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: this.translateService.instant('address.INTL_PHONE_CONFIRM'),
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  /** Resolve a namespaced key (e.g. 'menu.HELLENIKOS') from the Greek ('el') translations. */
  private elTranslation(namespacedKey: string): string {
    const dotIdx = namespacedKey.indexOf('.');
    if (dotIdx === -1) return namespacedKey;
    const ns = namespacedKey.slice(0, dotIdx);
    const rest = namespacedKey.slice(dotIdx + 1);
    const source: Record<string, unknown> =
      ns === 'menu' ? elMenu as Record<string, unknown> :
      ns === 'item-detail' ? elItemDetail as Record<string, unknown> : {};
    const parts = rest.split('.');
    let val: unknown = source;
    for (const part of parts) {
      if (val && typeof val === 'object') val = (val as Record<string, unknown>)[part];
      else return namespacedKey;
    }
    return typeof val === 'string' ? val : namespacedKey;
  }

  /** Return a copy of cart items with all displayable fields translated to Greek. */
  private toGreekCartItems(items: ReturnType<CartService['getItems']>) {
    return items.map(item => {
      const menuKey = 'menu.' + item.name;
      const greekName = this.elTranslation(menuKey);
      return {
        ...item,
        name: greekName !== menuKey ? greekName : item.name,
        sweetness: item.sweetness
          ? this.elTranslation('item-detail.SWEETNESS.' + item.sweetness)
          : item.sweetness,
        size: item.size
          ? this.elTranslation('item-detail.SIZE.' + item.size)
          : item.size,
        ingredients: (item.ingredients || []).map(ing => {
          const ingKey = 'menu.' + ing.name;
          const greekIng = this.elTranslation(ingKey);
          return { ...ing, name: greekIng !== ingKey ? greekIng : ing.name };
        }),
      };
    });
  }
}
