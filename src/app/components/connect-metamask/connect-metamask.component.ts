import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { EnMetamaskStateStatus, MetamaskService } from '../../metamask/metamask.service';

@Component({
  selector: 'app-connect-metamask',
  standalone: true,
  imports: [],
  templateUrl: './connect-metamask.component.html',
  styleUrl: './connect-metamask.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectMetamaskComponent {
  public disableConnect = computed(() => {
    return this.metaMaskService.state().status === EnMetamaskStateStatus.LOADING
  })

  constructor(
    public readonly metaMaskService: MetamaskService
  ) {
  }

  public onClickConnect(): void {
    this.metaMaskService.requestAccounts();
  }
}
