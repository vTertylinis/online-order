import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type AppMode = 'delivery' | 'dinein';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private router = inject(Router);

  readonly mode$: Observable<AppMode>;

  constructor() {
    this.mode$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.extractMode(e.urlAfterRedirects)),
      startWith(this.extractMode(this.router.url)),
    );
  }

  get isDineIn(): boolean {
    return this.extractMode(this.router.url) === 'dinein';
  }

  get mode(): AppMode {
    return this.extractMode(this.router.url);
  }

  private extractMode(url: string): AppMode {
    return url.startsWith('/dinein') ? 'dinein' : 'delivery';
  }
}
