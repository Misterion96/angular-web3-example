import { fromWei } from 'web3-utils';

export function parseBalance(value: bigint): number {
    return parseFloat(fromWei(value, 'ether')!);
}
