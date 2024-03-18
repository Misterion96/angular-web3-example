import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EthereumCoinsService, TEthereumCoin } from '~ethereum-coins';
import { isAddress } from 'web3-validator';
import { MetamaskService } from '~metamask';
import { TCommonForm } from '../types/common-form.type';

interface ITransferData<T> {
  receiveAddress: string;
  amount: number;
  coin: T;
}

type TTransferFormValue = ITransferData<TEthereumCoin>;
export type TTransferForm = TCommonForm<TTransferFormValue>;

@Injectable()
export class WalletTransferFormService {
  constructor(
    private readonly coinsService: EthereumCoinsService,
    private readonly metamaskService: MetamaskService
  ) {
  }

  public get coins(): TEthereumCoin[] {
    return this.coinsService.availableCoins
  }

  public initForm() {
    return new FormGroup<TTransferForm>({
      receiveAddress: new FormControl('', {
        validators: [Validators.required, this.validateAddress()],
        nonNullable: true
      }),
      coin: new FormControl(this.coins[0], {
          nonNullable: true
        }
      ),
      amount: new FormControl(0, {
        nonNullable: true
      })
    }, {
      updateOn: 'submit',
    })
  }

  // ONLY FOR DEV
  // public onSubmit(
  //   walletAddress: string,
  //   {
  //     receiveAddress,
  //     amount,
  //   }: TTransferFormValue
  // ): Promise<string> {
  //   const txParams = {
  //     from: walletAddress,
  //     to: receiveAddress,
  //     amount: toWei(amount, 'ether')
  //   }
  //
  //   return this.metamaskService.sendEthereum(txParams).then(transactionHash =>  ({transactionHash}))
  // }

  public onSubmit(
    walletAddress: string,
    {
      coin,
      receiveAddress,
      amount,
    }: TTransferFormValue
  ) {
    const tokenAddress: string = this.coinsService.getTokenAddress(coin);

    const transfer = this.metamaskService.createTokenTransfer(
      tokenAddress,
      receiveAddress,
      amount
    )

    return transfer.send({from: walletAddress})
  }

  private validateAddress(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const address = control.getRawValue();

      return isAddress(address)
        ? null
        : {invalidAddress: 'Invalid Address'}
    }
  }
}
