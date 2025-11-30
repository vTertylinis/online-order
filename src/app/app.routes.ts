import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'item/:id',
    loadComponent: () => import('./item-detail/item-detail.page').then((m) => m.ItemDetailPage),
  },
  {
    path: 'address',
    loadComponent: () => import('./address/address.page').then(m => m.AddressPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
