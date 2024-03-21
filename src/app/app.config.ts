import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';

import { MetamaskService } from '~metamask';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (service: MetamaskService) => () => service.init(),
      deps: [MetamaskService],
      multi: true
    },
  ]
};
