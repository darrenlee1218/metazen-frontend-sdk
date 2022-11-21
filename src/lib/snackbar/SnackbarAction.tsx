import React from 'react';

import { CloseIcon } from '@assets/icons/CloseIcon';
import { boxCreator } from '@components/boxCreator';

const CloseIconWrapper = boxCreator({
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
});

interface SnackbarActionProps {
  onClick: () => void;
}

export const SnackbarAction: React.FC<SnackbarActionProps> = ({ onClick }) => (
  <CloseIconWrapper onClick={onClick}>
    <CloseIcon />
  </CloseIconWrapper>
);
