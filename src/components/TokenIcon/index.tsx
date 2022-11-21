import React, { FC } from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

interface TokenIconProps {
  tokenIconUrl: string;
  networkIconUrl: string;
  isNative: boolean;
}

export const TokenIcon: FC<TokenIconProps> = ({ tokenIconUrl, networkIconUrl, isNative }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      badgeContent={
        !isNative && (
          <Avatar
            sx={{
              width: 16,
              height: 16,
            }}
            src={networkIconUrl}
            data-testid="network-icon"
          />
        )
      }
    >
      <Avatar sx={{ width: 40, height: 40 }} src={tokenIconUrl} />
    </Badge>
  );
};
