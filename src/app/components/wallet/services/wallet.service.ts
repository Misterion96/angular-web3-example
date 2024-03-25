import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { EthereumTokensService } from '~ethereum-tokens';
import { MetamaskService } from '~metamask';
import { IWalletInfo, TBalance } from '../components/wallet-info';

@Injectable()
export class WalletService {
  private readonly accountSubject$: BehaviorSubject<string> = new BehaviorSubject('');
  public readonly wallet$: Observable<IWalletInfo> = this.accountSubject$.asObservable().pipe(
    filter(Boolean),
    switchMap(async (address) => {
      const balances = await this.getBalances(address);

      return {address, balances}
    })
  )

  constructor(
    private readonly metamaskService: MetamaskService,
    private readonly tokensService: EthereumTokensService,
  ) {
  }

  public getWalletData(accountAddress: string): void {
    this.accountSubject$.next(accountAddress)
  }

  private getBalances(address: string) {
    return Promise.all([
      this.metamaskService.getEthBalance(address).then(value => ({token: 'eth', value})),
      this.getSpecificBalance(address, 'WETH')
    ]);
  }

  private async getSpecificBalance(walletAddress: string, token: string): Promise<TBalance> {
    const tokenAddress = await this.tokensService.getTokenAddress(token);

    return this.metamaskService.getTokenBalance(
      walletAddress, tokenAddress
    )
      .then(value => ({token, value}))
      .catch(() => ({token, value: 0}))
  }
}
