import React, { FC } from 'react';

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme, CustomTheme } from '@mui/material/styles';

import BarBox from '@components/BarBox';
import { boxCreator } from '@components/boxCreator';

const AvatarNameGroup = boxCreator({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
});

interface NetworkBarProps {
  networkIconUrl: string;
  chainName: string;
}

export const NetworkBar: FC<NetworkBarProps> = ({ networkIconUrl, chainName }) => {
  const theme = useTheme() as CustomTheme;

  return (
    <BarBox label="Network">
      <AvatarNameGroup>
        <Avatar
          src={networkIconUrl}
          sx={{ width: 24, height: 24, border: `1px solid ${theme.palette.colors.clickableGray}` }}
        />
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          {chainName}
        </Typography>
      </AvatarNameGroup>
    </BarBox>
  );
};
