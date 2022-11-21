import { BigNumber } from 'ethers';
import React, { FC, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { CustomTheme, useTheme, SxProps } from '@mui/material/styles';

import { boxCreator } from '@components/boxCreator';
import { FallbackImage } from '@components/FallbackImage';
import { SkeletonUtils } from '@components/SkeletonUtils';

import defaultFallbackSrc from '@assets/images/default-fallback.png';

import { Loadable } from '@gryfyn-types/generics';

const NftAssetDescriptor = boxCreator({
  mt: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  gap: 0.5,
});

const ImageBox = boxCreator({
  position: 'relative',
  borderRadius: 3,
  overflow: 'hidden',
});

export enum AssetVariant {
  Collection,
  Item,
}

interface NftAssetTileProps {
  variant: AssetVariant;
  assetIconUrl: string;
  assetName: string;
  assetQuantity: Loadable<string | number> | null;
  networkIconUrl?: string;
  sx?: SxProps;
  onClick: () => void;
}

export const NftAssetTile: FC<NftAssetTileProps> = ({
  variant,
  assetIconUrl,
  networkIconUrl,
  assetName,
  assetQuantity,
  sx,
  onClick,
}) => {
  const theme = useTheme() as CustomTheme;
  const shouldRenderItemQuantity = useMemo(() => {
    return variant === AssetVariant.Item && assetQuantity != null && BigNumber.from(assetQuantity).gt(1);
  }, [assetQuantity, variant]);

  return (
    <Box
      disableRipple
      component={CardActionArea}
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 1,
        border: `1px solid ${theme.palette.colors.border}`,
        height: 'fit-content',
        borderRadius: 3,
        ':hover': {
          borderColor: theme.palette.colors.clickableGrayHover,
        },
        ...sx,
      }}
    >
      <ImageBox>
        <FallbackImage
          src={assetIconUrl}
          fallbackSrc={defaultFallbackSrc}
          alt={`${assetName} image`}
          sx={{ display: 'block', width: '100%', objectFit: 'cover', aspectRatio: '1 / 1' }}
        />
        {shouldRenderItemQuantity && (
          <Typography
            color="text.secondary"
            variant="h5"
            sx={{
              width: 'fit-content',
              px: 0.5,
              borderRadius: 2,
              position: 'absolute',
              bottom: 4,
              left: 4,
              backgroundColor: theme.palette.colors.primaryText,
            }}
          >
            &times;{assetQuantity}
          </Typography>
        )}
      </ImageBox>

      {Boolean(networkIconUrl) && (
        <Avatar
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 24,
            height: 24,
          }}
          alt="network icon"
          src={networkIconUrl}
        />
      )}

      <NftAssetDescriptor data-testid="asset-descriptor">
        <Typography
          color="text.primary"
          variant="h5"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          sx={{
            overflow: 'hidden',
            fontWeight: 600,
            fontSize: 10,
          }}
        >
          {assetName}
        </Typography>

        {variant === AssetVariant.Collection && assetQuantity !== null && (
          <SkeletonUtils.Typography
            color="text.secondary"
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: 10,
            }}
            loadableContent={assetQuantity}
            skeletonProps={{ width: 12 }}
          >
            {assetQuantity} items
          </SkeletonUtils.Typography>
        )}
      </NftAssetDescriptor>
    </Box>
  );
};
