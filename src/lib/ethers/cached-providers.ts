// eslint-disable-next-line no-restricted-imports
import { providers } from 'ethers';
import hash from 'object-hash';

type ConstructorParams = ConstructorParameters<typeof providers.JsonRpcProvider>;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CachedJsonRpcProviders {
  private static readonly cachedProviders = new Map<string, providers.JsonRpcProvider>();

  static getInstance(...params: ConstructorParams) {
    const hashedParams = hash(params);

    if (this.cachedProviders.has(hashedParams)) {
      return this.cachedProviders.get(hashedParams)!;
    }

    const provider = new providers.JsonRpcProvider(...params);
    this.cachedProviders.set(hashedParams, provider);

    return provider;
  }

  static clearAll() {
    this.cachedProviders.clear();
  }
}
