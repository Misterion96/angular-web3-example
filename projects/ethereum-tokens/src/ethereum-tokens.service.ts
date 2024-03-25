import { Injectable } from '@angular/core';
import { DAI } from './tokens/DAI';
import { WETH } from './tokens/WETH';

const coins = [
  DAI,
  WETH
] as const;

const availableCoins = coins.map(c => c.type);

export type TEthereumToken = typeof availableCoins[number];

@Injectable({
  providedIn: 'root'
})
export class EthereumTokensService {
  public readonly availableTokens = availableCoins;

  // TODO fetch
  public async getTokenAddress(type: TEthereumToken | string): Promise<string> {
    return coins.find(c => c.type === type)?.tokenAddress!
  }
}
