import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ConfigService } from '../services/config.service';

/**
 * Guards the delivery-only routes (cart, address). When online ordering is
 * disabled the app is a menu-only site, so these routes silently redirect to
 * the menu home — old bookmarks land on the menu with no trace of a checkout
 * flow. Dine-in routes do not use this guard and are unaffected.
 */
export const onlineOrderingGuard: CanActivateFn = (): boolean | UrlTree => {
  const config = inject(ConfigService);
  const router = inject(Router);

  if (config.isOnlineOrderingEnabled) {
    return true;
  }
  return router.parseUrl('/home');
};
