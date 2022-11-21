import React, { FC } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import AssetIcon from '@components/AssetIcon';
import { boxCreator } from '@components/boxCreator';

import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';
import { TokenValueDisplay } from '@components/TokenValueDisplay';

const TokenDetailBox = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const TokenDetailRow = boxCreator({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: 0,
  gap: 2,
});

interface TokenDisplayRowProps extends Pick<TokenBalance, 'token' | 'price' | 'balanceInAssetDecimals'> {
  onClick?: () => void;
}

export const TokenDisplayRow: FC<TokenDisplayRowProps> = ({ token, price, balanceInAssetDecimals, onClick }) => {
  const isValidPrice = Boolean(price);

  return (
    <Box
      component={CardActionArea}
      sx={{
        p: 2,
        gap: 0.5,
        borderRadius: 4,
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: '40px minmax(0, 1fr)',
      }}
      onClick={onClick}
    >
      <AssetIcon
        assetIconLength={30}
        networkIconLength={14}
        assetImageUrl={token.display.svgIconUrl}
        networkLogoUrl={!token.isNative ? token.network.pngNetworkIconUrl : undefined}
      />
      <TokenDetailBox>
        <TokenDetailRow data-testid="name-balance-row">
          <Typography
            variant="h2"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            sx={{ overflow: 'hidden', fontWeight: 600 }}
          >
            {token.displayName}
          </Typography>
          <TokenValueDisplay.Amount
            variant="h2"
            whiteSpace="nowrap"
            sx={{ flexShrink: 0, fontWeight: 'medium' }}
            token={token}
            amount={balanceInAssetDecimals}
            precision="display"
          />
        </TokenDetailRow>
        {isValidPrice && (
          <TokenDetailRow data-testid="prices-row">
            <TokenValueDisplay.Currency
              variant="h4"
              color="text.secondary"
              token={token}
              pricePerAssetInUsd={price ?? ''}
              precision={token.displayPrecision}
            />

            <TokenValueDisplay.Currency
              variant="h4"
              color="text.secondary"
              token={token}
              amount={balanceInAssetDecimals}
              pricePerAssetInUsd={price!}
            />
          </TokenDetailRow>
        )}
      </TokenDetailBox>
    </Box>
  );
};
