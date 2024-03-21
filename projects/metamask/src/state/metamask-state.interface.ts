import { Web3 } from 'web3';
import { EnMetamaskStateStatus } from './metamask-state-status.enum';

export interface IMetamaskState {
  status: EnMetamaskStateStatus,
  accounts: string[],
  error?: any
  web3: Web3 | null,
}
