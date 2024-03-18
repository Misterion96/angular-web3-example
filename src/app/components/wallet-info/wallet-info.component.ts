import { NgForOf, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface IWalletInfo {
  address: string,
  balances: {
    coin: string,
    value: number,
  }[]
}

@Component({
  selector: 'app-wallet-info',
  standalone: true,
  imports: [
    NgForOf,
    UpperCasePipe
  ],
  templateUrl: './wallet-info.component.html',
  styleUrl: './wallet-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletInfoComponent {
  @Input({required: true})
  public wallet!: IWalletInfo
}
