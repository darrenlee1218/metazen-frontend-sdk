import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';
import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';
import { useNftCollectionItems } from '@hooks/useNftCollectionItems';
import { useGetAssetMetadataBatchQuery } from '@redux/api/assetMetadataCache';
import { useGetBalancesByAssetIdsQuery } from '@redux/api/bookKeeping';
import { renderHook } from '@testing-library/react-hooks';
import { mockImport } from '@utils/testing/mockImport';
import { constants } from 'ethers';

const mockNftTokens = [
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '1',
    balance: '1',
  },
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '2',
    balance: '1',
  },
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '3',
    balance: '1',
  },
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '4',
    balance: '0',
  },
] as unknown as NftTokenData[];

const mockNftAssetMetadata = [
  {
    tokenId: '1',
  },
  {
    tokenId: '2',
  },
] as unknown as NftAssetMetadata[];

jest.mock('@redux/api/bookKeeping');
const mockUseGetBalancesByAssetIdsQuery = mockImport(useGetBalancesByAssetIdsQuery);
jest.mock('@redux/api/assetMetadataCache');
const mockUseGetAssetMetadataBatchQuery = mockImport(useGetAssetMetadataBatchQuery);

it('should return an empty array if nftTokens is an empty array', () => {
  mockUseGetBalancesByAssetIdsQuery.mockReturnValue({ data: [] } as unknown as any);
  mockUseGetAssetMetadataBatchQuery.mockReturnValue({ data: mockNftAssetMetadata } as unknown as any);
  const { result } = renderHook(() =>
    useNftCollectionItems({ id: '', contractAddress: '0x0000000000000000000000000000000000000000' }),
  );
  expect(result.current.nftCollectionItems).toHaveLength(0);
});

it('should filter out items with no balance', () => {
  mockUseGetBalancesByAssetIdsQuery.mockReturnValue({ data: mockNftTokens } as unknown as any);
  mockUseGetAssetMetadataBatchQuery.mockReturnValue({ data: mockNftAssetMetadata } as unknown as any);
  const { result } = renderHook(() =>
    useNftCollectionItems({ id: '', contractAddress: '0x0000000000000000000000000000000000000000' }),
  );

  expect(result.current.nftCollectionItems.find((item) => item.nftTokenId === '4')).toBeUndefined();
});

it('should merge with nftMetadata', () => {
  mockUseGetBalancesByAssetIdsQuery.mockReturnValue({ data: mockNftTokens } as unknown as any);
  mockUseGetAssetMetadataBatchQuery.mockReturnValue({ data: mockNftAssetMetadata } as unknown as any);
  const { result } = renderHook(() =>
    useNftCollectionItems({ id: '', contractAddress: '0x0000000000000000000000000000000000000000' }),
  );
  expect(result.current).toMatchSnapshot();
});

test.each`
  loadingTokens | loadingMetadata | expected
  ${true}       | ${true}         | ${true}
  ${true}       | ${false}        | ${true}
  ${false}      | ${true}         | ${true}
  ${false}      | ${false}        | ${false}
`(
  'returns $expected when loadingTokens is $loadingTokens and loadingMetadata is $loadingMetadata',
  ({ loadingMetadata, loadingTokens, expected }) => {
    mockUseGetBalancesByAssetIdsQuery.mockReturnValue({ data: undefined, isLoading: loadingTokens } as unknown as any);
    mockUseGetAssetMetadataBatchQuery.mockReturnValue({
      data: undefined,
      isLoading: loadingMetadata,
    } as unknown as any);

    const { result } = renderHook(() =>
      useNftCollectionItems({ id: '', contractAddress: '0x0000000000000000000000000000000000000000' }),
    );
    expect(result.current.isLoading).toBe(expected);
  },
);
