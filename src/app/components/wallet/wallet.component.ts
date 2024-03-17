import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, filter, switchMap } from 'rxjs';
import { MetamaskService } from '../../metamask/metamask.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletComponent {
  private accountSubject$ = new BehaviorSubject('');

  public wallet$ = this.accountSubject$.asObservable().pipe(
    filter(Boolean),
    switchMap(async (address) => {
      const [
        eth,
        weth
      ] = await Promise.all([
        this.metamaskService.getBalance(address),
        this.metamaskService.getWethBalance(address)
      ]);

      return {
        address,
        eth,
        weth
      }
    })
  )

  @Input({required: true})
  set account(value: string) {
    this.accountSubject$.next(value)
  }

  constructor(
    private readonly metamaskService: MetamaskService
  ) {
  }
}
