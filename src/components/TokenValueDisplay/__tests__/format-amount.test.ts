import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { formatAmount } from '../format-amount';

const maticToken = {
  standard: TokenStandard.NATIVE,
  decimal: 18,
  custodyPrecision: 8,
  displayPrecision: 4,
  ticker: 'MATIC',
};

const revvmToken = {
  standard: TokenStandard.ERC1155,
  ticker: 'REVVM',
};

describe('formatAmount', () => {
  it('should not have < when balance equals minimum', () => {
    const result = formatAmount({ token: maticToken, amount: '100000000000000', precision: 'display' });
    expect(result).toEqual('0.0001 MATIC');
  });

  it('should have < when balance does not meet minimum', () => {
    const result = formatAmount({ token: maticToken, amount: '10000000000000', precision: 'display' });
    expect(result).toEqual('<0.0001 MATIC');
  });

  it('should round down', () => {
    const result = formatAmount({ token: maticToken, amount: '683026977859320', precision: 'display' });
    expect(result).toEqual('0.0006 MATIC');
  });

  it('should format smaller values correctly', () => {
    const result = formatAmount({
      token: maticToken,
      amount: '1',
      precision: 'custody',
    });

    expect(result).toEqual('<0.00000001 MATIC');
  });

  it('should format larger values correctly', () => {
    const result = formatAmount({
      token: maticToken,
      amount: '6830269778593200000',
      precision: 'display',
    });

    expect(result).toEqual('6.8302 MATIC');
  });

  it('should forrmat very large values correctly', () => {
    const result = formatAmount({
      token: maticToken,
      amount: '68302697785932000000000000000',
      precision: 'display',
    });

    expect(result).toEqual('68,302,697,785.932 MATIC');
  });

  it('should return 0 if the balance is 0', () => {
    const result = formatAmount({
      token: maticToken,
      amount: '0',
      precision: 'display',
    });

    expect(result).toEqual('0 MATIC');
  });

  it('should format with more decimals when custody precision is used', () => {
    const result = formatAmount({
      token: maticToken,
      amount: '6830269778593200000',
      precision: 'custody',
    });

    expect(result).toEqual('6.83026977 MATIC');
  });

  it('should return balance directly if standard is not NATIVE or ERC-20', () => {
    const result = formatAmount({
      token: revvmToken,
      amount: '1',
      precision: 'display',
    });

    expect(result).toEqual('1');
  });

  it('should truncate zeros at the end', () => {
    const result = formatAmount({
      token: maticToken,
      amount: '0x2386f26fc10000',
      precision: 'display',
    });

    expect(result).toEqual('0.01 MATIC');
  });

  it('should throw error if missing decimal data', () => {
    expect(() =>
      formatAmount({
        token: {
          standard: TokenStandard.NATIVE,
          ticker: 'MATIC',
        },
        amount: '100000000000000',
        precision: 'display',
      }),
    ).toThrowError();
  });
});
