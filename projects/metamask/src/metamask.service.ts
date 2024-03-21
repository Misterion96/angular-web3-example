import { Inject, Injectable, OnDestroy, Signal } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskProvider, EthExecutionAPI, ProviderAccounts } from 'web3';
import {
    toWei,
} from 'web3-utils'
import {
    Contract
} from 'web3-eth-contract'
import { ABI } from './abi';
import { IMetamaskState } from './state';
import { MetamaskStateService } from './state/metamask-state.service';
import { parseBalance } from './utils';

@Injectable({
    providedIn: 'root'
})
export class MetamaskService implements OnDestroy {
    private ethereum: MetaMaskProvider<EthExecutionAPI> | null = null;

    public get state(): Signal<IMetamaskState> {
        return this.stateService.state
    }

    constructor(
        private stateService: MetamaskStateService) {
    }

    public ngOnDestroy(): void {
        this.destroyListeners();
    }

    public async init(): Promise<void> {
        this.stateService.setLoading();
        const provider = await detectEthereumProvider({silent: true, mustBeMetaMask: true});

        if (!provider) {
            this.stateService.setError(new Error('no provider'))
            return
        }

        this.ethereum = provider as unknown as MetaMaskProvider<EthExecutionAPI>;
        this.stateService.setWeb3(this.ethereum);

        try {
            this.stateService.setAccounts(await this.stateService.eth.getAccounts());
        } catch (e: unknown) {
            this.stateService.setError(e)
        }

        this.initListeners();
    }

    public async requestAccounts(): Promise<void> {
        this.stateService.setLoading();

        try {
            this.stateService.setAccounts(await this.ethereum?.request({method: 'eth_requestAccounts'}) as string[])
        } catch (e: unknown) {
            this.stateService.setError(e)
        }
    }

    public async getEthBalance(address: string): Promise<number> {
        const balance: bigint = await this.stateService.eth.getBalance(address);

        return parseBalance(balance);
    }

    public async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<number> {
        const web3 = this.stateService.web3;
        const contract: Contract<typeof ABI> = new Contract(ABI, tokenAddress, web3.getContextObject());
        const balance: bigint = await contract.methods['balanceOf'](walletAddress).call();

        return parseBalance(balance);
    }

    public createTokenTransfer(
        tokenAddress: string,
        receiveAddress: string,
        amount: number
    ) {
        const web3 = this.stateService.web3;
        const contract: Contract<typeof ABI> = new Contract(ABI, tokenAddress, web3.getContextObject());
        const sendAmount = toWei(amount, 'ether');

        return contract.methods['transfer'](receiveAddress, sendAmount);
    }

    private setAccounts(accounts: ProviderAccounts): void {
        this.stateService.setAccounts(accounts)
    }

    private initListeners(): void {
        this.ethereum?.on("accountsChanged", this.setAccounts.bind(this));
    }

    private destroyListeners(): void {
        this.ethereum?.removeListener("accountsChanged", this.setAccounts.bind(this));
    }
}
