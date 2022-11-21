import React from 'react';

import ListItemText from '@mui/material/ListItemText';

import { formatAddress } from '@utils/format';
import { IconResponseType } from '@pages/RecentActivity/constant';

interface TextProps {
  from: string;
  to: string;
  depositOrWithdrawal: string;
}

export const SecondaryText: React.FC<TextProps> = ({ from, to, depositOrWithdrawal }) => {
  let prefix = '';
  let address = from;
  switch (depositOrWithdrawal) {
    case IconResponseType.WITHDRAWAL:
      prefix = 'To';
      address = to;
      break;
    case IconResponseType.DEPOSIT:
      prefix = 'From';
      address = from;
      break;
    default:
      prefix = 'From';
      address = from;
      break;
  }

  return (
    <ListItemText
      secondaryTypographyProps={{ fontSize: '12px', marginTop: '-6px' }}
      secondary={`${prefix}: ${formatAddress(address)} `}
    />
  );
};
