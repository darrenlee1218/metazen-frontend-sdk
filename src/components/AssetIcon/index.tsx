import React from 'react';

import Box from '@mui/material/Box';
import { CustomTheme, useTheme } from '@mui/material/styles';

interface AssetIconProps {
  assetImageUrl: string;
  networkLogoUrl?: string;
  assetIconLength?: number;
  networkIconLength?: number;
  placeholderAssetImageUrl?: string;
  placeholderNetworkImageUrl?: string;
}

const AssetIcon: React.FC<AssetIconProps> = ({
  assetImageUrl,
  networkLogoUrl,
  placeholderAssetImageUrl,
  placeholderNetworkImageUrl,
  assetIconLength = 24,
  networkIconLength = 12,
}) => {
  const theme = useTheme() as CustomTheme;
  const adjustLengthForContainerAsset = 6;
  const assetImage = assetImageUrl ?? placeholderAssetImageUrl;
  const networkImage = networkLogoUrl ?? placeholderNetworkImageUrl;
  const containerLength = assetIconLength + adjustLengthForContainerAsset;

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${containerLength}px`,
        height: `${containerLength}px`,
      }}
    >
      <Box
        component="div"
        sx={{
          borderRadius: '50%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          width: `${assetIconLength}px`,
          height: `${assetIconLength}px`,
          backgroundImage: `url(${assetImage})`,
          border: `1px solid ${theme.palette.colors.border}`,
        }}
      >
        {networkImage && (
          <Box
            component="div"
            sx={{
              right: 0,
              borderRadius: '50%',
              position: 'absolute',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: `${networkIconLength}px`,
              height: `${networkIconLength}px`,
              backgroundImage: `url(${networkImage})`,
              border: `1px solid ${theme.palette.colors.border}`,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AssetIcon;
