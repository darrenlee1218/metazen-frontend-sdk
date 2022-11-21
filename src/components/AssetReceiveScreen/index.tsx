import { QRCodeSVG } from 'qrcode.react';
import React, { ComponentProps, FC, useMemo } from 'react';

import Stack from '@mui/material/Stack';
import ButtonComponent from '@components/Button';
import Typography from '@mui/material/Typography';
import { BalanceBar } from '@components/BalanceBar';
import { boxCreator } from '@components/boxCreator';
import { NetworkBar } from '@components/NetworkBar';
import BackNavigation from '@components/BackNavigation';
import { CustomTheme, useTheme } from '@mui/material/styles';
import { WalletAddressBar } from '@components/WalletAddressBar';
import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';

export enum ReceiveVariant {
  Nft,
  Token,
}

export interface AssetReceiveScreenProps {
  chainName: string;
  displayName: string;
  onClose: () => void;
  networkIconUrl: string;
  balance?: TokenBalance;
  variant: ReceiveVariant;
  onBackPress: () => void;
  recipientAddress: string;
}

const ContentBox = boxCreator({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 3,
  pb: 3,
});

const QRCodeBorderBox = boxCreator({
  padding: 1.5,
  border: '1px solid',
  borderRadius: 3,
  borderColor: (theme) => theme.palette.primary.main,
  '> *': {
    display: 'block',
  },
});

const Footer = boxCreator({
  px: 3,
  py: 2,
  position: 'sticky',
  bottom: 0,
  borderTop: (theme) => `1px solid ${theme.palette.colors.border}`,
  background: (theme) => theme.palette.colors.appBackground,
});

/**
 * @dev flex parent is recommended
 */
export const AssetReceiveScreen: FC<AssetReceiveScreenProps> = ({
  variant,
  recipientAddress,
  displayName,
  chainName,
  networkIconUrl,
  balance,
  onClose: handleClose,
  onBackPress,
}) => {
  const theme = useTheme() as CustomTheme;
  const imageSettings = useMemo<ComponentProps<typeof QRCodeSVG>['imageSettings']>(() => {
    if (variant === ReceiveVariant.Nft || !balance) return undefined;

    return {
      width: 24,
      height: 24,
      excavate: false,
      src: balance.token.display.svgIconUrl,
    };
  }, [balance, variant]);

  return (
    <>
      <BackNavigation label={`Receive ${displayName}`} onBackPress={onBackPress} />

      <ContentBox>
        <QRCodeBorderBox>
          <QRCodeSVG
            size={180}
            value={recipientAddress}
            fgColor={theme.palette.common.white}
            bgColor={theme.palette.colors.appBackground}
            imageSettings={imageSettings}
            level={'H'}
          />
        </QRCodeBorderBox>
        <Typography variant="h3" align="center" color="text.secondary" sx={{ mt: 1.5, fontSize: 10 }}>
          Send only {displayName} on <span style={{ fontWeight: 600 }}>{chainName}</span> network to this deposit
          address. Sending any other coins may result in permanent loss.
        </Typography>
        <Stack sx={{ mt: 3 }} spacing={1.5}>
          <NetworkBar networkIconUrl={networkIconUrl} chainName={chainName} />
          <WalletAddressBar walletAddress={recipientAddress} />
          {Boolean(balance) && <BalanceBar {...balance!} />}
        </Stack>
      </ContentBox>
      <Footer>
        <ButtonComponent
          fullWidth
          color="secondary"
          variant="contained"
          onClick={handleClose}
          sx={{ fontWeight: 600, fontSize: 16, color: 'text.primary' }}
        >
          Close
        </ButtonComponent>
      </Footer>
    </>
  );
};
