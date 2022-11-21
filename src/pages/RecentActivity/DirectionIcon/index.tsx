import React from 'react';

import { StatusClockIcon } from '@assets/icons/StatusClockIcon';
import { StatusReceiveIcon } from '@assets/icons/StatusReceiveIcon';
import { StatusSendIcon } from '@assets/icons/StatusSendIcon';
import { StatusFrozenIcon } from '@assets/icons/StatusFrozenIcon';
import { StatusCancelledIcon } from '@assets/icons/StatusCancelledIcon';
import { StatusFailedIcon } from '@assets/icons/StatusFailedIcon';

import { IconResponseType } from '../constant';

interface IconProps {
  status: string;
  depositOrWithdrawal: string;
}

const iconStyle = {
  width: '14px',
  height: '14px',
};

export const DirectionIcon: React.FC<IconProps> = ({ status, depositOrWithdrawal }) => {
  switch (true) {
    case status === 'Detected':
    case status === 'Approving':
    case status === 'Pending':
      return <StatusClockIcon {...iconStyle} />;
    case status === 'Failed':
    case status === 'Declined':
      return <StatusFailedIcon {...iconStyle} />;
    case status === 'Frozen':
      return <StatusFrozenIcon {...iconStyle} />;
    case status === 'Cancelled':
      return <StatusCancelledIcon {...iconStyle} />;
    case status === 'Completed' && depositOrWithdrawal === IconResponseType.WITHDRAWAL:
      return <StatusSendIcon {...iconStyle} />;
    case status === 'Completed' && depositOrWithdrawal === IconResponseType.DEPOSIT:
    default:
      return <StatusReceiveIcon {...iconStyle} />;
  }
};
