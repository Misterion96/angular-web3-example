import { Injectable, OnDestroy, signal } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { Web3, Web3EthInterface, MetaMaskProvider, EthExecutionAPI } from 'web3';
import {
  toWei,
  fromWei
} from 'web3-utils'
import {
  Contract
} from 'web3-eth-contract'
import { ABI } from './abi';

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
  web3: Web3 | null,
}

const initialState: IMetamaskState = {
  status: EnMetamaskStateStatus.IDLE,
  accounts: [],
  web3: null,
}

const ethereum: MetaMaskProvider<EthExecutionAPI> = (window as any).ethereum;

@Injectable({
  providedIn: 'root'
})
export class MetamaskService implements OnDestroy {
  private readonly _state = signal<IMetamaskState>(initialState);
  public readonly state = this._state.asReadonly();

  public ngOnDestroy(): void {
    this.destroyListeners();
  }

  private get eth(): Web3EthInterface {
    return this._state().web3?.eth!;
  }

  public async init(): Promise<void> {
    this.setLoading();
    const provider = await detectEthereumProvider({silent: true, mustBeMetaMask: true});

    if (!provider) {
      this.setError(new Error('no provider'))
      return
    }

    this.setWeb3(provider as any);

    try {
      this.setAccounts(await this.eth.getAccounts());
    } catch (e: unknown) {
      this.setError(e)
    }

    this.initListeners();
  }

  public async requestAccounts(): Promise<void> {
    this.setLoading();

    try {
      this.setAccounts(await ethereum.request({method: 'eth_requestAccounts'}) as string[])
    } catch (e: unknown) {
      this.setError(e)
    }
  }

  public async getBalance(address: string): Promise<number> {
    const balance: bigint = await this.eth.getBalance(address);

    return this.parseBalance(balance);
  }

  public async getSpecificBalance(walletAddress: string, tokenAddress: string): Promise<number> {
    const web3 = this._state().web3!;
    const contract: Contract<typeof ABI> = new Contract(ABI, tokenAddress, web3.getContextObject());
    const balance: bigint = await contract.methods['balanceOf'](walletAddress).call();

    return this.parseBalance(balance);
  }

  public createTokenTransfer(
    tokenAddress: string,
    receiveAddress: string,
    amount: number
  ) {
    const web3 = this._state().web3!;
    const contract: Contract<typeof ABI> = new Contract(ABI, tokenAddress, web3.getContextObject());
    const sendAmount = toWei(amount, 'ether');

    return contract.methods['transfer'](receiveAddress, sendAmount);
  }

  // public sendEthereum(params: any): Promise<string> {
  //   return ethereum.request<string>({
  //     method: 'eth_sendTransaction',
  //     params: [params]
  //   }) as Promise<string>
  // }


  private setLoading(): void {
    this._state.update(s => ({
      ...s,
      status: EnMetamaskStateStatus.LOADING,
    }))
  }

  private setWeb3(provider: MetaMaskProvider<EthExecutionAPI>): void {
    const web3 = new Web3(provider);
    this._state.update(s => ({
      ...s,
      web3,
    }))
  }

  private setAccounts(accounts: string[]): void {
    const status: EnMetamaskStateStatus = accounts.length
      ? EnMetamaskStateStatus.READY
      : EnMetamaskStateStatus.IDLE;

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
    return parseFloat(fromWei(value, 'ether')!);
  }

  private initListeners(): void {
    ethereum.on("accountsChanged", this.setAccounts.bind(this));
  }

  private destroyListeners(): void {
    ethereum.removeListener("accountsChanged", this.setAccounts.bind(this));
  }
}
