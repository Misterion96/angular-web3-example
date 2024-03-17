import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectMetamaskComponent } from './components/connect-metamask/connect-metamask.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { MetamaskService } from './metamask/metamask.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, AsyncPipe, NgIf, WalletComponent, ConnectMetamaskComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public hasProvider = computed(() => Boolean(this.metaMaskService.state().provider))
  public accounts = computed(() => this.metaMaskService.state().accounts)

  constructor(public readonly metaMaskService: MetamaskService) {
    effect(() => {
      console.log(this.accounts())
    })
  }

  public ngOnInit(): void {
  }


}
