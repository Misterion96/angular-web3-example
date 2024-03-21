import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WalletTransferFormComponent } from './components/wallet-transfer-form';
import { IWalletInfo, WalletInfoComponent } from './components/wallet-info';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    WalletInfoComponent,
    NgIf,
    WalletTransferFormComponent
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WalletService]
})
export class WalletComponent {
  public readonly wallet: Signal<IWalletInfo | null> = toSignal(this.walletService.wallet$, {
    initialValue: null
  });

  constructor(private walletService: WalletService) {
  }

  @Input({required: true})
  set account(value: string) {
    this.walletService.getWalletData(value);
  }
}
