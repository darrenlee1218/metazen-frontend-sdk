import { renderHook } from '@testing-library/react-hooks';
import { useTokenBalances } from '../useTokenBalances';
import { mockImport } from '@utils/testing/mockImport';
import { useGetBalancesQuery } from '@redux/api/bookKeeping';
import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useGetPricesQuery } from '@redux/api/assetEvaluator';
import { fixtures } from '@utils/testing/fixtures';
import { constants } from 'ethers';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { useSelector } from 'react-redux';

jest.mock('@redux/api/bookKeeping');
const mockedUseBalancesQuery = mockImport(useGetBalancesQuery);

jest.mock('@redux/api/assetMaster');
const mockedUseGetTokensQuery = mockImport(useGetTokensQuery);

jest.mock('@redux/api/assetEvaluator');
const mockedUseGetPricesQuery = mockImport(useGetPricesQuery);

jest.mock('react-redux');
const mockedUseSelector = mockImport(useSelector);

it('should call useGetPricesQuery with the expected asset keys', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(...['0_A', '0_B', '0_C', '0_D'].map((c) => ({ assetId: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['0_B', '0_C'].map((c) => ({ key: c, ticker: c.split('_')[1] }))),
    isLoading: false,
  } as unknown as any);
  // relevant tokens
  mockedUseSelector.mockReturnValueOnce(['0_B', '0_E', '0_F'] as ReturnType<typeof useSelector>);

  renderHook(() => useTokenBalances());
  expect(mockedUseGetPricesQuery).toHaveBeenCalledWith(['0_B', '0_E', '0_F', '0_C'], expect.anything());
});

it('should filter for only NATIVE and ERC-20 tokens', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(...['A', 'B', 'C', 'D'].map((c) => ({ assetId: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['B', 'C'].map((c) => ({ key: c, ticker: c, standard: TokenStandard.ERC721 }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockReturnValue({ data: [], isLoading: false } as unknown as any);
  mockedUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.otherTokenBalances).toHaveLength(0);
});

it('amountUsdValue should be undefined when price is undefined', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(...['A', 'B', 'C', 'D'].map((c) => ({ assetId: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['B', 'C'].map((c) => ({ key: c, ticker: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockReturnValue({ data: [], isLoading: false } as unknown as any);
  mockedUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  result.current.otherTokenBalances.forEach((tb) => {
    expect(tb.amountUsdValue).toBeUndefined();
  });
});

it('should return the expected price, amount, and amountUsdValue', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(
      { assetId: 'A', balance: constants.WeiPerEther.toString() }, // balance: 1
      { assetId: 'B', balance: constants.WeiPerEther.mul(2).toString() }, // balance: 2
    ),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['A', 'B'].map((c) => ({ key: c, ticker: c, decimals: 18 }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockImplementation(((assetKeys: string[]) => ({
    isLoading: false,
    data: fixtures.prices.create(...assetKeys.map((assetKey) => ({ assetKey, price: '100' }))),
  })) as unknown as any);
  mockedUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.otherTokenBalances).toStrictEqual([
    expect.objectContaining({
      price: '100',
      amount: '2',
      amountUsdValue: '200',
    }),
    expect.objectContaining({
      price: '100',
      amount: '1',
      amountUsdValue: '100',
    }),
  ]);
});

it('splits into gameTokenBalances and otherTokenBalances correctly', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(...['A', 'B', 'C', 'D'].map((c) => ({ assetId: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['A', 'B', 'C', 'D'].map((c) => ({ key: c, ticker: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockReturnValue({ data: [], isLoading: false } as unknown as any);
  mockedUseSelector.mockReturnValueOnce(['C'] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.relevantTokenBalances.map((tb) => tb.token.ticker)).toStrictEqual(['C']);
  expect(result.current.otherTokenBalances.map((tb) => tb.token.ticker)).toStrictEqual(['A', 'B', 'D']);
});

it('gameTokenBalances should not filter out when balance is 0', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create({ assetId: 'A', balance: '0' }, { assetId: 'B', balance: '0' }),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['A', 'B'].map((c) => ({ key: c, ticker: c, decimals: 18 }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockImplementation(((assetTickers: string[]) => ({
    isLoading: false,
    data: fixtures.prices.create(...assetTickers.map((ticker) => ({ ticker, price: 100 }))),
  })) as unknown as any);
  mockedUseSelector.mockReturnValueOnce(['A', 'B'] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.relevantTokenBalances).toHaveLength(2);
});

it('otherTokenBalances should filter out balances <= 0', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(
      { assetId: 'A', balance: constants.WeiPerEther.mul(0).toString() },
      { assetId: 'B', balance: constants.WeiPerEther.mul(-10).toString() },
      { assetId: 'C', balance: constants.WeiPerEther.mul(10).toString() },
    ),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['A', 'B', 'C'].map((c) => ({ key: c, ticker: c, decimals: 18 }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockImplementation(((assetTickers: string[]) => ({
    isLoading: false,
    data: fixtures.prices.create(...assetTickers.map((ticker) => ({ ticker, price: 100 }))),
  })) as unknown as any);
  mockedUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.otherTokenBalances).toHaveLength(1);
});

it('should sort gameTokenBalances in the order of the provided gameTokens list', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(...['A', 'B', 'C', 'D'].map((c) => ({ assetId: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(...['A', 'B', 'C', 'D'].map((c) => ({ key: c, ticker: c }))),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockReturnValue({ data: [], isLoading: false } as unknown as any);
  mockedUseSelector.mockReturnValueOnce(['B', 'A', 'D', 'C'] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.relevantTokenBalances.map((tb) => tb.token.ticker)).toStrictEqual(['B', 'A', 'D', 'C']);
});

it('should sort otherTokenBalances in amountUsdValue DESC', () => {
  mockedUseBalancesQuery.mockReturnValue({
    data: fixtures.balances.create(
      ...['0_A', '0_B', '0_C', '0_D'].map((c, i) => ({
        assetId: c,
        balance: constants.WeiPerEther.mul(i + 1).toString(),
      })),
    ),
    isLoading: false,
  } as unknown as any);
  mockedUseGetTokensQuery.mockReturnValue({
    data: fixtures.tokens.create(
      ...['0_A', '0_B', '0_C', '0_D'].map((c) => ({ key: c, ticker: c.split('_')[1], decimals: 18 })),
    ),
    isLoading: false,
  } as unknown as any);
  mockedUseGetPricesQuery.mockImplementation(((assetKeys: string[]) => ({
    isLoading: false,
    data: fixtures.prices.create(
      ...assetKeys.map((assetKey, index) => ({ assetKey, price: String((index + 1) * 100) })),
    ),
  })) as unknown as any);
  mockedUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useTokenBalances());
  expect(result.current.otherTokenBalances.map((tb) => tb.token.ticker)).toStrictEqual(['D', 'C', 'B', 'A']);
});
