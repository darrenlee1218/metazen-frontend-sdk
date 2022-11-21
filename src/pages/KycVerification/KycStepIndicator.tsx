import React, { FC, memo } from 'react';

import Box from '@mui/material/Box';
import { CustomTheme, useTheme } from '@mui/material/styles';

interface KycStepIndicatorProps {
  isSelected: boolean;
}

export const KycStepIndicator: FC<KycStepIndicatorProps> = memo(({ isSelected }) => {
  const theme = useTheme() as CustomTheme;

  return (
    <Box
      component="span"
      sx={{
        height: 12,
        width: 12,
        borderRadius: '50%',
        backgroundColor: isSelected ? theme.palette.common.white : theme.palette.colors.placeholderText,
      }}
    />
  );
});
