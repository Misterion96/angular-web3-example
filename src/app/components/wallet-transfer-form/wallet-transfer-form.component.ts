import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TEthereumCoin } from '~ethereum-coins';
import { TTransferForm, WalletTransferFormService } from './services/wallet-transfer-form.service';
import { markControlAsTouchedAndValidate } from './utils/mark-control-as-touched-and-validate';

@Component({
  selector: 'app-wallet-transfer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './wallet-transfer-form.component.html',
  styleUrl: './wallet-transfer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WalletTransferFormService]
})
export class WalletTransferFormComponent implements OnInit {
  public readonly result = signal('');
  public readonly errors = signal('');
  public readonly coins: TEthereumCoin[] = this.transferFormService.coins;

  public form!: FormGroup<TTransferForm>;

  @Input({required: true})
  public walletAddress!: string

  constructor(
    private readonly transferFormService: WalletTransferFormService
  ) {
  }
  public ngOnInit(): void {
    this.form = this.transferFormService.initForm();
  }

  public get addressControl(): AbstractControl<string> | null {
    return this.form.get('receiveAddress');
  }

  public get amountControl(): AbstractControl<number> | null {
    return this.form.get('amount')
  }

  public onSubmit(): void {
    this.result.set('');
    this.errors.set('');

    markControlAsTouchedAndValidate(this.form!)

    if(this.form.invalid){
      return
    }

    this.form.disable({emitEvent: true});

    this.transferFormService.onSubmit(
      this.walletAddress,
      (this.form.value as any)
    )
      .then(({transactionHash}) => this.result.set(transactionHash))
      .catch((e) => this.errors.set(e.message))
      .finally(() => this.form.enable())
  }
}
