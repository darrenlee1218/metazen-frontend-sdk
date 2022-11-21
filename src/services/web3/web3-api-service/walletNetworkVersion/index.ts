import { HexNumber } from '@gryfyn-types/data-transfer-objects/JrpcWalletAddress';
import { ActiveEmit, bridgeDataEmitter } from '../messageEventHandler/bridgeDataEmitter';
const DEFAULT_NETWORK_VERSION = process.env.REACT_APP_DEFAULT_NETWORK_VERSION;
if (!DEFAULT_NETWORK_VERSION) {
  // sorry have to do this
  console.error('[ENV] missing env variable `REACT_APP_DEFAULT_NETWORK_VERSION`.');
  console.error('[ENV] For testnet please set to `80001`, and mainet for `137`');
  throw new Error('ENV variable missing');
}

export class NetworkVersion {
  /**
   * This class is for standard response of request from dapp provider during the `connect` event.
   * Explain:
   * in eip 1193, the defination of `chainId` is the hexadecimal version of `chainId` we are using throught the system
   * to avoid confusion, here we have to get chainId function, one is for sending out to provider,
   * the other is for gryfyn use
   */
  private _network: string;
  constructor(network: string) {
    this._network = network;
  }

  /**
   * Decimal version of "chainId", e.g. '80001' for matic
   * @param network
   */
  public setNetwork(network: string) {
    if (network !== this._network) {
      this._network = network;
      bridgeDataEmitter({
        id: -1,
        method: ActiveEmit.CHAIN_CHANGED,
        response: {
          chainId: this.getProviderChainId(),
        },
      });
    }
  }

  public getProviderChainId(): HexNumber {
    return `0x${Number(this._network).toString(16)}` as HexNumber;
  }

  public getChainId(): string {
    return this._network;
  }
}

export const networkVersion = Object.seal(new NetworkVersion(DEFAULT_NETWORK_VERSION));
