import { AbstractControl } from '@angular/forms';

// TODO move SDK
export type TCommonForm<T> = {
  [P in keyof T]: AbstractControl<T[P]>
}
