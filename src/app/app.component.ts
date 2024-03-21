import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectMetamaskComponent } from './components/connect-metamask/connect-metamask.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { MetamaskService } from '~metamask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, AsyncPipe, NgIf, WalletComponent, ConnectMetamaskComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public hasProvider = computed(() => Boolean(this.metaMaskService.state().web3))
  public accounts = computed(() => this.metaMaskService.state().accounts.slice(0, 1))

  constructor(public readonly metaMaskService: MetamaskService) {
  }
}
