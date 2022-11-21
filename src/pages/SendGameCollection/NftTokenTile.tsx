import React, { FC, useCallback, useMemo } from 'react';

import { CustomTheme, useTheme } from '@mui/material/styles';
import { AssetVariant, NftAssetTile } from '@components/NftAssetTile';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';
import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';

interface NftTokenTileProps {
  nftToken: NftTokenData;
  collectionContractAddress: string;
  isSelected: boolean;
  onClick: (tokenKey: string | null) => void;
}

export const NftTokenTile: FC<NftTokenTileProps> = ({ nftToken, collectionContractAddress, isSelected, onClick }) => {
  const theme = useTheme() as CustomTheme;
  const { chainId, nftTokenId } = nftToken;
  const { data: nftMetadata } = useGetAssetMetadataQuery({
    chainId,
    contractAddress: collectionContractAddress,
    tokenId: nftTokenId,
  });

  const { assetIconUrl, assetName } = useMemo(() => {
    if (nftMetadata?.data) {
      return {
        assetIconUrl: nftMetadata.data.image,
        assetName: nftMetadata.data.name,
      };
    }

    return {
      assetIconUrl: '',
      assetName: '',
    };
  }, [nftMetadata]);

  const handleClick = useCallback(() => {
    onClick(isSelected ? null : nftTokenId ?? null);
  }, [isSelected, nftTokenId, onClick]);

  return (
    <NftAssetTile
      variant={AssetVariant.Collection}
      assetIconUrl={assetIconUrl}
      assetName={assetName}
      assetQuantity={null}
      onClick={handleClick}
      sx={{
        border: `1px solid ${isSelected ? theme.palette.primary.main : theme.palette.colors.border}`,
        ':hover': {
          borderColor: isSelected ? theme.palette.primary.main : theme.palette.colors.clickableGrayHover,
        },
      }}
    />
  );
};
