import styled from '@emotion/styled';
import { FieldPath } from 'react-hook-form';
import React, { FC, ReactNode } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Step from '@mui/material/Step';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import StepContent from '@mui/material/StepContent';
import { CustomPalette } from '@mui/material/styles';
import StepLabel, { StepLabelProps } from '@mui/material/StepLabel';
import { AccessTimeRounded, Check, CheckRounded, Clear, CloseRounded } from '@mui/icons-material';

import { StepLevel, StepStatus } from '@hooks/useAccountLevel';
import { AccountLevelItemStatus } from '@gryfyn-types/props/AccountLevelItemStatus';
import { LockIcon } from '@assets/icons/LockIcon';

const StyledStep = styled(Step)`
  &:last-child {
    .MuiStepContent-root {
      border-color: transparent;
    }
  }
`;

const StyledList = styled(List)`
  padding: 0;
  margin-left: ${({ theme }) => theme.spacing(1.5)};
  & > * + * {
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
`;

const StyledListItem = styled(ListItem)`
  padding: 0;
  gap: ${({ theme }) => theme.spacing(1)};
  .MuiListItemAvatar-root {
    min-width: unset;
  }

  svg {
    height: 12px;
    width: 12px;
  }
`;

export interface AccountLevelItemProps {
  label: string;
  status: AccountLevelItemStatus;
}

interface AccountStepItem {
  label: string;
  status: AccountLevelItemStatus;
}

interface IStep {
  levelId: StepLevel;
  status: StepStatus;
  heading: string;
  items: AccountStepItem[];
  fromKycReminder?: boolean;
  description?: string;
}

const itemStatusIconMap: Record<AccountLevelItemStatus, ReactNode> = {
  [AccountLevelItemStatus.NoProgress]: (
    <CheckRounded
      sx={{ padding: '2px', backgroundColor: 'colors.border', borderRadius: '50%', color: 'common.black' }}
      color="disabled"
    />
  ),
  [AccountLevelItemStatus.Pending]: (
    <AccessTimeRounded
      sx={{ padding: '2px', backgroundColor: 'info.main', borderRadius: '50%', color: 'common.black' }}
      color="inherit"
    />
  ),
  [AccountLevelItemStatus.Rejected]: (
    <CloseRounded
      sx={{ padding: '2px', backgroundColor: 'error.main', borderRadius: '50%', color: 'common.black' }}
      color="error"
    />
  ),
  [AccountLevelItemStatus.Approved]: (
    <CheckRounded
      sx={{ padding: '2px', backgroundColor: 'success.main', borderRadius: '50%', color: 'common.black' }}
      color="success"
    />
  ),
};

const AccountLevelItem: FC<AccountLevelItemProps> = ({ label, status }) => {
  return (
    <StyledListItem key={label}>
      {itemStatusIconMap[status]}
      <Typography variant="h4" color="text.primary">
        {label}
      </Typography>
    </StyledListItem>
  );
};

type IconColor = FieldPath<CustomPalette>;
const IconBox = styled(Box)`
  border-radius: 50%;
  padding: ${({ theme }) => theme.spacing(1.5)};
  background-color: ${({ theme }) => theme.palette.colors.nonClickableGray};
  font-size: 16px;
  border: 1px solid currentColor;

  svg {
    display: block;
    font-size: 16px;
    width: 16px;
    height: 16px;
  }
`;

const statusData: Record<
  StepStatus,
  {
    Icon: NonNullable<StepLabelProps['StepIconComponent']>;
    label: string;
    color: IconColor;
  }
> = {
  [StepStatus.Unlocked]: {
    Icon: () => (
      <IconBox color="success.main">
        <Check fontSize="inherit" color="inherit" />
      </IconBox>
    ),

    label: 'Unlocked',
    color: 'success.main',
  },
  [StepStatus.Locked]: {
    Icon: () => (
      <IconBox color="transparent">
        <LockIcon fontSize="inherit" color="inherit" />
      </IconBox>
    ),
    label: 'Locked',
    color: 'text.secondary',
  },
  [StepStatus.VerificationInProgress]: {
    Icon: () => (
      <IconBox color="info.main">
        <AccessTimeRounded fontSize="inherit" color="inherit" />
      </IconBox>
    ),
    label: 'Verification in Progress',
    color: 'info.main',
  },
  [StepStatus.VerificationFailed]: {
    Icon: () => (
      <IconBox color="colors.errorPrimary">
        <Clear fontSize="inherit" color="inherit" />
      </IconBox>
    ),
    label: 'Verification Failed',
    color: 'colors.errorPrimary',
  },
};

export const AccountStep: FC<IStep> = ({ levelId, heading, items, status, description, fromKycReminder }) => {
  const { Icon, label, color } = statusData[status];

  return (
    <StyledStep expanded>
      <StepLabel
        StepIconComponent={Icon}
        sx={{
          py: 0,
          '.MuiStepLabel-iconContainer': {
            pr: 1.5,
          },
        }}
      >
        <Typography variant="h4">
          Level {levelId} ·{' '}
          <Box sx={{ color }} component="span">
            {label}
          </Box>
        </Typography>
        <Typography variant="h2" fontWeight={600} color="text.primary" mt={1}>
          {heading}
        </Typography>
      </StepLabel>

      <StepContent sx={{ pt: 2, pb: 3, borderColor: status === StepStatus.Unlocked ? color : 'colors.border' }}>
        {fromKycReminder ? (
          <Typography variant="h4" color="text.primary">
            {description}
          </Typography>
        ) : (
          <StyledList>
            {items.map((item) => (
              <AccountLevelItem key={item.label} label={item.label} status={item.status} />
            ))}
          </StyledList>
        )}
      </StepContent>
    </StyledStep>
  );
};
