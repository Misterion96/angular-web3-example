import { Injectable } from '@angular/core';
import { DAI } from './tokens/DAI';
import { WETH } from './tokens/WETH';

const coins = [
  DAI,
  WETH
] as const;

const availableCoins = coins.map(c => c.type);

export type TEthereumCoin = typeof availableCoins[number];

@Injectable({
  providedIn: 'root'
})
export class EthereumCoinsService {
  public readonly availableCoins = availableCoins;

  public getTokenAddress(type: TEthereumCoin): string {
    return coins.find(c => c.type === type)?.tokenAddress!
  }
}
