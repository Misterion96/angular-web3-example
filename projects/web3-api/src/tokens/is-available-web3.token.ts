import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';


export const ETHEREUM_TOKEN = new InjectionToken(
  'ETHEREUM_TOKEN', {
    providedIn: 'root',
    factory: () => (inject(WINDOW) as Window & { ethereum: unknown }).ethereum || null
  }
)
export const IS_AVAILABLE_WEB3_TOKEN = new InjectionToken('IS_AVAILABLE_WEB3_TOKEN', {
  providedIn: 'root',
  factory: () => {

  }
})
