import { TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('app-lang');
    await TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideIonicAngular(), provideZoneChangeDetection()]
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('el', {});
    translate.setTranslation('en', {});
  });

  afterEach(() => localStorage.removeItem('app-lang'));

  it('should create the Ionic app shell', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('ion-app ion-router-outlet')).toBeTruthy();
  });

  it('should use Greek when no language has been saved', () => {
    TestBed.createComponent(AppComponent);
    expect(TestBed.inject(TranslateService).getCurrentLang()).toBe('el');
  });

  it('should restore the saved language', () => {
    localStorage.setItem('app-lang', 'en');
    TestBed.createComponent(AppComponent);
    expect(TestBed.inject(TranslateService).getCurrentLang()).toBe('en');
  });
});
