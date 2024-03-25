import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { WalletTransactionFormResultComponent } from './components';
import { WalletTransferFormService } from './services';
import { TTransferForm } from './types';
import { markControlAsTouchedAndValidate } from './utils/mark-control-as-touched-and-validate';

@Component({
  selector: 'app-wallet-transfer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    WalletTransactionFormResultComponent,
    NgForOf
  ],
  templateUrl: './wallet-transfer-form.component.html',
  styleUrl: './wallet-transfer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WalletTransferFormService]
})
export class WalletTransferFormComponent implements OnInit {
  public readonly transactionResult = this.transferFormService.transactionResult;
  public readonly tokens: string[] = this.transferFormService.tokens;

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
    markControlAsTouchedAndValidate(this.form!)

    if (this.form.invalid) {
      return
    }

    this.form.disable({emitEvent: true});

    this.transferFormService.onSubmit(
      this.walletAddress,
      (this.form.value as any)
    ).finally(() => this.form.enable())
  }
}
