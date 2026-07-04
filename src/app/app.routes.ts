import { Routes } from '@angular/router';
import { onlineOrderingGuard } from './guards/online-ordering.guard';

export const routes: Routes = [
  // ── Delivery (online ordering) routes ─────────────────────────────────
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'item/:id',
    loadComponent: () => import('./item-detail/item-detail.page').then((m) => m.ItemDetailPage),
  },
  {
    // Delivery checkout routes — disabled (redirect to /home) while online
    // ordering is off. Guard is a no-op when it is re-enabled.
    path: 'address',
    canActivate: [onlineOrderingGuard],
    loadComponent: () => import('./address/address.page').then((m) => m.AddressPage),
  },
  {
    path: 'cart',
    canActivate: [onlineOrderingGuard],
    loadComponent: () => import('./cart/cart.page').then((m) => m.CartPage),
  },

  // ── Dine-in routes  (QR code: 21ierissos.gr/#/dinein/home) ─────────────
  {
    path: 'dinein',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'item/:id',
        loadComponent: () => import('./item-detail/item-detail.page').then((m) => m.ItemDetailPage),
      },
      {
        path: 'cart',
        loadComponent: () => import('./cart/cart.page').then((m) => m.CartPage),
      },
      {
        path: 'table',
        loadComponent: () => import('./dinein-table/table.page').then((m) => m.TablePage),
      },
      {
        path: 'success',
        loadComponent: () => import('./dinein-success/dinein-success.page').then((m) => m.DineInSuccessPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },

  // ── Default ────────────────────────────────────────────────────────────
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
