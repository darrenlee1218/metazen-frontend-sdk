import React, { FC } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { StarIcon } from '@assets/icons/StarIcon';
import { boxCreator } from '@components/boxCreator';

const ComingSoonBox = boxCreator({
  p: '12px',
  display: 'flex',
  gap: 1.5,
  backgroundColor: (theme) => theme.palette.colors.nonClickableGray,
  borderRadius: 3,
  alignItems: 'center',
});

export const GameRewards: FC = () => {
  return (
    <Stack sx={{ p: 3 }} spacing={3}>
      <Typography align="center" variant="h1" sx={{ fontWeight: 600 }}>
        Game Rewards
      </Typography>

      <ComingSoonBox>
        <Avatar
          sx={{
            backgroundColor: 'colors.clickableGray',
            color: 'common.white',
            fontSize: 8,
            width: '24px',
            height: '24px',
          }}
        >
          <StarIcon stroke="white" width="10px" height="10px" fill="none" />
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Claim rewards is coming soon!
        </Typography>
      </ComingSoonBox>
    </Stack>
  );
};
