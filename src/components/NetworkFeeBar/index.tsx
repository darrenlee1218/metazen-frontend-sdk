import React, { FC } from 'react';

import BarBox from '@components/BarBox';
import Typography from '@mui/material/Typography';

interface NetworkFeeBarProps {
  formattedGasFee: string;
}

export const NetworkFeeBar: FC<NetworkFeeBarProps> = ({ formattedGasFee }) => {
  return (
    <BarBox label="Network Fee">
      <Typography color="text.primary" fontWeight="600">
        {formattedGasFee}
      </Typography>
    </BarBox>
  );
};
