import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnTransactionResultStatus } from '../../enum';
import { TTransactionResult } from '../../types';

@Component({
  selector: 'app-wallet-transaction-form-result',
  standalone: true,
  imports: [
    NgSwitch,
    NgSwitchCase
  ],
  templateUrl: './wallet-transaction-form-result.component.html',
  styleUrl: './wallet-transaction-form-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletTransactionFormResultComponent {
  public readonly status = EnTransactionResultStatus

  @Input({required: true})
  public result!: TTransactionResult
}
