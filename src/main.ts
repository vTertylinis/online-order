import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from './app/services/config.service';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withHashLocation()),
    provideHttpClient(),
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true,
    },
  ],
});
