import React, { FC, ReactNode, useMemo } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AccessTimeRounded, CheckRounded, CloseRounded } from '@mui/icons-material';

import { StepStatus } from '@hooks/useAccountLevel';
import { LockIcon } from '@assets/icons/LockIcon';
import { CustomTheme, useTheme } from '@mui/material';

interface IconTitleStatusProps {
  iconNode: ReactNode;
  heading: string;
  status: StepStatus;
}

const IconTitleStatus: FC<IconTitleStatusProps> = ({ iconNode, heading, status }) => {
  const theme = useTheme() as CustomTheme;

  const stepStatusIconMap: Record<StepStatus, ReactNode> = useMemo(
    () => ({
      [StepStatus.Locked]: <LockIcon width={12} height={12} stroke={theme.palette.text.secondary} />,
      [StepStatus.VerificationInProgress]: (
        <AccessTimeRounded
          sx={{ padding: '2px', backgroundColor: 'info.main', borderRadius: '50%', color: 'common.black' }}
          color="inherit"
        />
      ),
      [StepStatus.VerificationFailed]: (
        <CloseRounded
          sx={{ padding: '2px', backgroundColor: 'error.main', borderRadius: '50%', color: 'common.black' }}
          color="error"
        />
      ),
      [StepStatus.Unlocked]: (
        <CheckRounded
          sx={{ padding: '2px', backgroundColor: 'success.main', borderRadius: '50%', color: 'common.black' }}
          color="success"
        />
      ),
    }),
    [theme.palette.text.secondary],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {iconNode}
        <Typography
          variant="h2"
          color="text.primary"
          sx={{ fontSize: '10px', marginLeft: '8px', fontWeight: 'regular' }}
        >
          {heading}
        </Typography>
      </Box>
      <Box sx={{ svg: { width: 12, height: 12 } }} data-step-status={status}>
        {stepStatusIconMap[status]}
      </Box>
    </Box>
  );
};

export default IconTitleStatus;
