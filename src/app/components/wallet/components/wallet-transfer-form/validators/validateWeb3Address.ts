import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isAddress } from 'web3-validator';

// TODO move SDK
export function validateWeb3Address(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const address = control.getRawValue();

    return isAddress(address)
      ? null
      : {invalidAddress: 'Invalid Address'}
  }
}
