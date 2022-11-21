import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { formatCurrency } from '../format-currency';

describe('formatCurrency', () => {
  it('should throw error when used with unsupported standard || missing decimals', () => {
    expect(() =>
      formatCurrency({
        token: {
          standard: TokenStandard.ERC1155,
          decimal: 0,
        },
        amount: '0',
        pricePerAssetInUsd: '0',
      }),
    ).toThrowError();

    expect(() =>
      formatCurrency({
        token: {
          standard: TokenStandard.NATIVE,
        },
        amount: '0',
        pricePerAssetInUsd: '0',
      }),
    ).toThrowError();
  });

  it('should return < when result is less than minimum', () => {
    const result = formatCurrency({
      token: {
        standard: TokenStandard.ERC20,
        decimal: 6,
      },
      amount: '4000',
      pricePerAssetInUsd: '1.00009175',
    });

    expect(result).toContain('<');
  });

  it('should always be in the provided precision', () => {
    const result = formatCurrency({
      token: {
        standard: TokenStandard.ERC20,
        decimal: 6,
      },
      amount: '400000',
      pricePerAssetInUsd: '1',
      precision: 2,
    });

    expect(result).toEqual('$0.40');
  });

  it('should round down', () => {
    const result = formatCurrency({
      token: {
        standard: TokenStandard.ERC20,
        decimal: 6,
      },
      amount: '399999',
      pricePerAssetInUsd: '1',
    });

    expect(result).toEqual('$0.39');
  });

  it('should return $0.00 when balance is 0', () => {
    const result = formatCurrency({
      token: {
        standard: TokenStandard.ERC20,
        decimal: 6,
      },
      amount: '0',
      pricePerAssetInUsd: '1',
    });

    expect(result).toEqual('$0.00');
  });

  it('should format very small values correctly', () => {
    const result = formatCurrency({
      token: {
        standard: TokenStandard.ERC20,
        decimal: 18,
      },
      amount: '1',
      pricePerAssetInUsd: '1',
      precision: 8,
    });

    expect(result).toEqual('<$0.00000001');
  });

  it('should format very large values correctly', () => {
    const result = formatCurrency({
      token: {
        standard: TokenStandard.ERC20,
        decimal: 18,
      },
      amount: '68302697785932000000000000000',
      pricePerAssetInUsd: '1',
      precision: 2,
    });

    expect(result).toEqual('$68,302,697,785.93');
  });
});
