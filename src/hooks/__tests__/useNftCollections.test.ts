import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { useNftCollections } from '@hooks/useNftCollections';
import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useGetBalancesByAssetIdsQuery } from '@redux/api/bookKeeping';
import { useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { mockImport } from '@utils/testing/mockImport';
import { constants } from 'ethers';
import { fixtures } from '@utils/testing/fixtures';

jest.mock('@redux/api/assetMaster');
const mockUseGetTokensQuery = mockImport(useGetTokensQuery);

jest.mock('@redux/api/bookKeeping');
const mockUseGetBalancesByAssetIdsQuery = mockImport(useGetBalancesByAssetIdsQuery);
jest.mock('react-redux');
const mockUseSelector = mockImport(useSelector);

it('should not return ERC-20 assets', () => {
  mockUseGetTokensQuery.mockReturnValueOnce({
    data: fixtures.tokens.create(
      ...Array.from({ length: 10 }).map((_, i) => ({ key: String(i + 1), standard: TokenStandard.ERC20 })),
    ),
  } as unknown as ReturnType<typeof useGetTokensQuery>);

  mockUseGetBalancesByAssetIdsQuery.mockReturnValueOnce({
    data: [],
  } as unknown as ReturnType<typeof useGetBalancesByAssetIdsQuery>);

  mockUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useNftCollections());
  expect(result.current.allCollections).toHaveLength(0);
});

it('should calculate numUniqueItems correctly', () => {
  const length = 10;
  mockUseGetTokensQuery.mockReturnValueOnce({
    data: fixtures.tokens.create(
      ...Array.from({ length }).map((_, i) => ({ key: String(i + 1), standard: TokenStandard.ERC721 })),
    ),
  } as unknown as ReturnType<typeof useGetTokensQuery>);

  mockUseGetBalancesByAssetIdsQuery.mockReturnValueOnce({
    data: Array.from({ length }).flatMap((_, i) =>
      Array.from({ length: i + 1 }).map(() => ({
        assetId: String(i + 1),
        balance: String(i + 1),
      })),
    ),
  } as unknown as ReturnType<typeof useGetBalancesByAssetIdsQuery>);

  mockUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useNftCollections());
  for (let i = 0; i < length; ++i) {
    expect(result.current.otherNftCollections[i].numUniqueItems).toBe(i + 1);
  }
});

it('numUniqueItems should be undefined is getBalances is still loading', () => {
  const length = 10;
  mockUseGetTokensQuery.mockReturnValueOnce({
    data: fixtures.tokens.create(
      ...Array.from({ length }).map((_, i) => ({ key: String(i + 1), standard: TokenStandard.ERC721 })),
    ),
  } as unknown as ReturnType<typeof useGetTokensQuery>);

  mockUseGetBalancesByAssetIdsQuery.mockReturnValueOnce({
    data: [],
    isLoading: true,
  } as unknown as ReturnType<typeof useGetBalancesByAssetIdsQuery>);

  mockUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useNftCollections());
  for (let i = 0; i < length; ++i) {
    expect(result.current.otherNftCollections[i].numUniqueItems).toBeUndefined();
  }
});

it('should filter out all nftCollections with 0 items', () => {
  const length = 10;
  mockUseGetTokensQuery.mockReturnValueOnce({
    data: fixtures.tokens.create(
      ...Array.from({ length }).map((_, i) => ({ key: String(i + 1), standard: TokenStandard.ERC721 })),
    ),
  } as unknown as ReturnType<typeof useGetTokensQuery>);

  mockUseGetBalancesByAssetIdsQuery.mockReturnValueOnce({
    data: Array.from({ length: length / 2 }).flatMap((_, i) =>
      Array.from({ length: i + 1 }).map(() => ({
        assetId: String(i + 1),
        balance: String(i + 1),
      })),
    ),
  } as unknown as ReturnType<typeof useGetBalancesByAssetIdsQuery>);

  mockUseSelector.mockReturnValueOnce([] as ReturnType<typeof useSelector>);

  const { result } = renderHook(() => useNftCollections());
  expect(result.current.otherNftCollections).toHaveLength(5);
});

it('should split results based on NftWhitelist', () => {
  const length = 10;
  const mockTokens = fixtures.tokens.create(
    ...Array.from({ length }).map((_, i) => ({
      key: String(i),
      standard: TokenStandard.ERC721,
      contractAddress: constants.AddressZero + String(i),
    })),
  );

  mockUseGetTokensQuery.mockReturnValueOnce({
    data: mockTokens,
  } as unknown as ReturnType<typeof useGetTokensQuery>);

  mockUseGetBalancesByAssetIdsQuery.mockReturnValueOnce({
    data: Array.from({ length }).map((_, i) => ({
      assetId: String(i),
      balance: String(i),
    })),
  } as unknown as ReturnType<typeof useGetBalancesByAssetIdsQuery>);

  mockUseSelector.mockReturnValueOnce(Array.from({ length: 3 }).map((_, i) => mockTokens[i].key));

  const { result } = renderHook(() => useNftCollections());
  expect(result.current.relevantNftCollection).toHaveLength(3);
  expect(result.current.otherNftCollections).toHaveLength(7);
  expect(result.current.allCollections).toHaveLength(10);
});
