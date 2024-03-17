import { Injectable, OnDestroy, signal } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { Contract, Web3, Web3EthInterface } from 'web3';
import { ABI } from './utils/abi';

export enum EnMetamaskStateStatus {
  IDLE,
  ERROR,
  LOADING,
  READY
}

export interface IMetamaskState {
  status: EnMetamaskStateStatus,
  accounts: string[],
  error?: any
  provider: Web3 | null
}

const initialState: IMetamaskState = {
  status: EnMetamaskStateStatus.IDLE,
  accounts: [],
  provider: null
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService implements OnDestroy {
  private _state = signal<IMetamaskState>(initialState);
  public state = this._state.asReadonly();

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  public get eth(): Web3EthInterface {
    return this._state().provider!.eth;
  }

  public get utils() {
    return this._state().provider?.utils;
  }

  public async init(): Promise<void> {
    this.setLoading();
    const provider = await detectEthereumProvider({silent: true, mustBeMetaMask: true});

    if (!provider) {
      this.setError(new Error('no provider'))
      return
    }

    this.setProvider(new Web3((window as any).ethereum));
    try {
      const accounts = await this.eth.getAccounts();
      this.setAccounts(accounts);
    } catch (e: unknown) {
      this.setError(e)
    }

    this.initListeners();
  }

  public async requestAccounts(): Promise<void> {
    this.setLoading();

    try {
      const ethereum = (window as any).ethereum;
      this.setAccounts(ethereum.request({method: 'eth_requestAccounts'}))
    } catch (e: unknown) {
      this.setError(e)
    }
  }

  public async getBalance(address: string): Promise<number> {
    const balance: bigint = await this.eth.getBalance(address);

    return this.parseBalance(balance);
  }

  public async getWethBalance(address: string): Promise<number> {
    const wethContract: Contract<typeof ABI> = new this.eth.Contract(ABI, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')!;
    const balance: bigint = await wethContract.methods['balanceOf'](address).call();

    return this.parseBalance(balance);
  }


  private setLoading(): void {
    this._state.update(s => ({
      ...s,
      status: EnMetamaskStateStatus.LOADING,
    }))
  }

  private setProvider(provider: Web3): void {
    this._state.update(s => ({
      ...s,
      provider
    }))
  }

  private setAccounts(accounts: string[]): void {
    const status: EnMetamaskStateStatus = accounts.length ? EnMetamaskStateStatus.READY : EnMetamaskStateStatus.IDLE;
    this._state.update(s => ({
      ...s,
      status,
      accounts
    }))
  }

  private setError<T>(error: T): void {
    this._state.update(s => ({
      ...s,
      status: EnMetamaskStateStatus.ERROR,
      error
    }))
  }

  private parseBalance(value: bigint): number {

    return parseFloat(this.utils?.fromWei(value, 'ether')!);
  }

  private initListeners(): void {
    const ethereum = (window as any).ethereum;

    ethereum.on("accountsChanged", this.setAccounts.bind(this));
  }

  private destroyListeners(): void {
    const ethereum = (window as any).ethereum;

    ethereum.removeListener("accountsChanged", this.setAccounts.bind(this));
  }
}
