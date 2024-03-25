import { Injectable, signal } from '@angular/core';
import { EthExecutionAPI, MetaMaskProvider, Web3, Web3EthInterface } from 'web3';
import { RegisteredSubscription } from 'web3-eth';
import { EnMetamaskStateStatus } from './metamask-state-status.enum';
import { IMetamaskState } from './metamask-state.interface';

const initialState: IMetamaskState = {
  status: EnMetamaskStateStatus.IDLE,
  accounts: [],
  web3: null,
}


@Injectable({providedIn: 'root'})
export class MetamaskStateService {
  private readonly _state = signal<IMetamaskState>(initialState);
  public readonly state = this._state.asReadonly();

  public get eth(): Web3EthInterface {
    return this.web3.eth!;
  }

  public get web3(): Web3<RegisteredSubscription> {
    return this._state().web3!
  }

  public setLoading(): void {
    this._state.update(s => ({
      ...s,
      status: EnMetamaskStateStatus.LOADING,
    }))
  }

  public setWeb3(provider: MetaMaskProvider<EthExecutionAPI>): void {
    const web3 = new Web3(provider);
    this._state.update(s => ({
      ...s,
      web3,
    }))
  }

  public setAccounts(accounts: string[]): void {
    const status: EnMetamaskStateStatus = accounts.length
      ? EnMetamaskStateStatus.READY
      : EnMetamaskStateStatus.IDLE;

    this._state.update(s => ({
      ...s,
      status,
      accounts
    }))
  }

  public setError<T>(error: T): void {
    this._state.update(s => ({
      ...s,
      status: EnMetamaskStateStatus.ERROR,
      error
    }))
  }
}
