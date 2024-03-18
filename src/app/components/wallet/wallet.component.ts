import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EthereumCoinsService, TEthereumCoin } from '~ethereum-coins';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { MetamaskService } from '~metamask';
import { WalletTransferFormComponent } from '../wallet-transfer-form/wallet-transfer-form.component';
import { IWalletInfo, WalletInfoComponent } from '../wallet-info/wallet-info.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    WalletInfoComponent,
    NgIf,
    WalletTransferFormComponent
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletComponent {
  private readonly accountSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  private readonly wallet$: Observable<IWalletInfo> = this.accountSubject$.asObservable().pipe(
    filter(Boolean),
    switchMap(async (address) => {
      const balances = await this.getBalances(address);

      return {address, balances}
    })
  )

  public readonly wallet: Signal<IWalletInfo | null> = toSignal(this.wallet$, {
    initialValue: null
  });

  @Input({required: true})
  set account(value: string) {
    this.accountSubject$.next(value)
  }

  constructor(
    private readonly metamaskService: MetamaskService,
    private readonly coinsService: EthereumCoinsService,
  ) {
  }

  private getBalances(address: string) {
    return Promise.all([
      this.metamaskService.getBalance(address).then(value => ({coin: 'eth', value})),
      this.getSpecificBalance(address, 'WETH')
    ]);
  }

  private async getSpecificBalance(walletAddress: string, coin: TEthereumCoin): Promise<IWalletInfo['balances'][number]> {
    const tokenAddress = this.coinsService.getTokenAddress(coin);

    return this.metamaskService.getSpecificBalance(
      walletAddress, tokenAddress
    )
      .then(value => ({coin, value}))
      .catch(() => ({coin, value: 0}))
  }
}
