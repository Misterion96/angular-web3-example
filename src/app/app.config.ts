import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MetamaskService } from './metamask/metamask.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (service: MetamaskService) => () => service.init(),
      deps: [MetamaskService],
      multi: true
    },
    provideRouter(routes)
  ]
};
