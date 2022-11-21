import React from 'react';

import Box from '@mui/material/Box';

import { ArrowUpRightIcon } from '@assets/icons/ArrowUpRightIcon';
import { ArrowDownLeftIcon } from '@assets/icons/ArrowDownLeftIcon';

import { CircularIconButton } from '@components/CircularIconButton';

export interface WalletKeyActionsBarProps {
  canSend?: boolean;
  onSendClick: () => void;
  onReceiveClick: () => void;
}

const SendReceiveActionsBar: React.FC<WalletKeyActionsBarProps> = ({ onSendClick, onReceiveClick, canSend = true }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      pb: '24px',
      gap: '42px',
    }}
  >
    <CircularIconButton label="Send" disabled={!canSend} onClick={onSendClick} icon={<ArrowUpRightIcon />} />
    <CircularIconButton label="Receive" onClick={onReceiveClick} icon={<ArrowDownLeftIcon />} />
  </Box>
);

export default SendReceiveActionsBar;
