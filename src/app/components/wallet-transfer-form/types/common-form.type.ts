import { AbstractControl } from '@angular/forms';

export type TCommonForm<T> = {
  [P in keyof T]: AbstractControl<T[P]>
}
