import { ConnectionInfo } from 'ethers/lib/utils';
import { CachedJsonRpcProviders } from './cached-providers';

describe('CachedJsonRpcProviders', () => {
  beforeEach(() => {
    CachedJsonRpcProviders.clearAll();
  });

  it('should return the same provider instance if it has already been created', () => {
    const params: ConnectionInfo = {
      throttleLimit: 1,
      url: 'https://ethereum-ropsten-rpc.allthatnode.com',
    };

    const provider = CachedJsonRpcProviders.getInstance(params);

    expect(CachedJsonRpcProviders.getInstance(params)).toBe(provider);
  });

  it('should return the same provider if the params are in a different order', () => {
    const provider = CachedJsonRpcProviders.getInstance({
      throttleLimit: 1,
      url: 'https://ethereum-ropsten-rpc.allthatnode.com',
    });

    expect(
      CachedJsonRpcProviders.getInstance({
        url: 'https://ethereum-ropsten-rpc.allthatnode.com',
        throttleLimit: 1,
      }),
    ).toBe(provider);
  });

  it('shoudl return a new instance if requested with different params', () => {
    const providerA = CachedJsonRpcProviders.getInstance({
      throttleLimit: 1,
      url: 'https://ethereum-ropsten-rpc.allthatnode.com',
    });

    const providerB = CachedJsonRpcProviders.getInstance({
      throttleLimit: 1,
      url: 'https://ethereum-rinkeby-rpc.allthatnode.com',
    });

    expect(providerA).not.toBe(providerB);
  });
});
