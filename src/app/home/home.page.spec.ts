import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgZone, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../services/config.service';
import { ModeService } from '../services/mode.service';
import { CartService } from '../services/cart.service';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mode: { isDineIn: boolean };

  beforeEach(async () => {
    mode = { isDineIn: false };
    await TestBed.configureTestingModule({
      imports: [HomePage, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideIonicAngular(),
        provideZoneChangeDetection(),
        { provide: ConfigService, useValue: { isOnlineOrderingEnabled: false } },
        { provide: ModeService, useValue: mode },
        { provide: CartService, useValue: { getItems: () => [] } },
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('el', { menu: { POPULAR: 'Popular in Greek' } });
    translate.setTranslation('en', { menu: { POPULAR: 'Popular in English' } });
    translate.use('el');
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => localStorage.removeItem('app-lang'));

  it('should render the menu using block control flow', () => {
    expect(fixture.nativeElement.querySelectorAll('.menu-item').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('.category-name').textContent).toContain('Popular in Greek');
    expect(fixture.nativeElement.querySelector('.cart-fab')).toBeNull();
  });

  it('should render category changes from an asynchronous language update', async () => {
    const categoryElement = fixture.nativeElement.querySelector('.category-section');
    const itemElement = fixture.nativeElement.querySelector('.menu-item');
    const translate = TestBed.inject(TranslateService);
    TestBed.inject(NgZone).run(() => setTimeout(() => translate.use('en'), 0));
    await fixture.whenStable();
    expect(component.currentLang).toBe('en');
    expect(fixture.nativeElement.querySelector('.category-name').textContent).toContain('Popular in English');
    expect(fixture.nativeElement.querySelector('.category-section')).toBe(categoryElement);
    expect(fixture.nativeElement.querySelector('.menu-item')).toBe(itemElement);
  });

  it('should keep dine-in pricing and cart navigation', async () => {
    mode.isDineIn = true;
    // An event schedules the same change detection used by the application.
    (fixture.nativeElement.querySelector('.lang-btn') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(component.getDisplayPrice({ name: 'Coffee', price: 3, dineInPrice: 4 })).toBe(4);
    expect(component.cartRoute).toBe('/dinein/cart');
    expect(fixture.nativeElement.querySelector('.cart-fab')).toBeTruthy();
  });
});
