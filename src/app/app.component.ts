import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AnalyticsService } from './services/analytics.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private translate = inject(TranslateService);

  private analytics = inject(AnalyticsService);

  constructor() {
    this.analytics.start();
    this.translate.setFallbackLang('el');
    const savedLang = localStorage.getItem('app-lang') || 'el';
    this.translate.use(savedLang);
  }
}
