import { Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EthereumTokensService } from '~ethereum-tokens';
import { MetamaskService } from '~metamask';
import { EnTransactionResultStatus } from '../enum';
import { TTransactionResult, TTransferForm, TTransferFormValue } from '../types';
import { validateWeb3Address } from '../validators';

@Injectable()
export class WalletTransferFormService {
    public readonly transactionResult = signal<TTransactionResult>({
        status: EnTransactionResultStatus.IDLE
    });

    constructor(
        private readonly tokensService: EthereumTokensService,
        private readonly metamaskService: MetamaskService
    ) {
    }

    public get tokens(): string[] {
        return this.tokensService.availableTokens
    }

    public initForm() {
        return new FormGroup<TTransferForm>({
            receiveAddress: new FormControl('', {
                validators: [Validators.required, validateWeb3Address()],
                nonNullable: true
            }),
            coin: new FormControl(this.tokens[0], {
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

    public async onSubmit(
        walletAddress: string,
        {
            coin,
            receiveAddress,
            amount,
        }: TTransferFormValue
    ) {
        this.transactionResult.set({status: EnTransactionResultStatus.LOADING});
        const tokenAddress: string = await this.tokensService.getTokenAddress(coin);

        const transfer = this.metamaskService.createTokenTransfer(
            tokenAddress,
            receiveAddress,
            amount
        )

        return transfer.send({from: walletAddress}).then(({transactionHash}) => {
            this.transactionResult.set({
                status: EnTransactionResultStatus.SUCCESS,
                value: transactionHash
            })
        })
            .catch((e) => {
                this.transactionResult.set({
                    status: EnTransactionResultStatus.ERROR,
                    value: e
                })
            })
    }
}
