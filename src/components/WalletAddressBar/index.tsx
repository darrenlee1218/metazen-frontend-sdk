import React, { useCallback, useState, useEffect } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { CopyIcon } from '@assets/icons/CopyIcon';

import BarBox from '@components/BarBox';
import { boxCreator } from '@components/boxCreator';

import WalletAddressProps from '@gryfyn-types/props/WalletAddressProps';

const AddressButtonGroup = boxCreator({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2.5,
});

export const WalletAddressBar = ({ walletAddress, walletLable = 'Wallet Address' }: WalletAddressProps) => {
  const [isTooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(walletAddress);
    setTooltipOpen(true);
  }, [walletAddress]);

  // Hide tooltip after 1s
  useEffect(() => {
    if (isTooltipOpen) {
      setTimeout(() => setTooltipOpen(false), 1000);
    }
  }, [isTooltipOpen]);

  return (
    <BarBox label={walletLable}>
      <AddressButtonGroup>
        <Typography
          variant="h2"
          color="text.primary"
          sx={{
            maxWidth: 240,
            fontWeight: 600,
            wordWrap: 'break-word',
          }}
        >
          {walletAddress}
        </Typography>
        <Tooltip arrow open={isTooltipOpen} title="Copied!" placement="top">
          <IconButton size="small" onClick={handleCopy} data-testid="copy-button" sx={{ mb: '10px', fontSize: 16 }}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </AddressButtonGroup>
    </BarBox>
  );
};
