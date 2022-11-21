import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import ButtonComponent from '@components/Button';
import { boxCreator } from '@components/boxCreator';
import BackNavigation from '@components/BackNavigation';

import { useAccountLevel } from '@hooks/useAccountLevel';

import { useSnackbar } from '@lib/snackbar';
import { ConfettiIcon } from '@assets/icons/ConfettiIcon';

import { AccountStep } from './AccountStep';

const Footer = boxCreator({
  px: 3,
  py: 2,
  position: 'sticky',
  bottom: 0,
  backgroundColor: (theme) => theme.palette.colors.appBackground,
  borderTop: (theme) => `1px solid ${theme.palette.colors.border}`,
});

export const AccountLevel: FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme() as CustomTheme;
  const { steps, accountLevelButtonProps, isAccountSetupComplete, isLoadAccountLevelError } = useAccountLevel();

  useEffect(() => {
    isLoadAccountLevelError && enqueueSnackbar('Unable to fetch KYC status', { variant: 'error' });
  }, [isLoadAccountLevelError]);
  return (
    <>
      <BackNavigation label="Account Level" onBackPress={() => navigate('/account')} />

      {isAccountSetupComplete && (
        <Alert
          sx={{
            mx: 1.5,
            mt: 2,
            py: 0,

            background: theme.palette.colors.successSecondary,
            borderRadius: '4px',

            '.MuiAlert-icon': {
              mr: 1,
              alignItems: 'center',
              p: 0,
            },
          }}
          icon={<ConfettiIcon fill={theme.palette.colors.successPrimary} sx={{ width: 12, height: 12 }} />}
        >
          <Typography color="text.primary" variant="h4">
            Congratulations! Your account is fully unlocked.
          </Typography>
        </Alert>
      )}
      <Stepper
        orientation="vertical"
        sx={{
          mt: 2,
          px: 2,
          flexGrow: 1,
          '.MuiStepContent-root': {
            ml: '20px',
          },
        }}
        connector={null}
      >
        {steps.map(({ levelId, heading, items, status }) => (
          <AccountStep key={levelId} levelId={levelId} heading={heading} items={items} status={status} />
        ))}
      </Stepper>
      {accountLevelButtonProps && (
        <Footer>
          <ButtonComponent
            fullWidth
            color="primary"
            variant="contained"
            data-testid="account-level-action-button"
            {...accountLevelButtonProps}
          />
        </Footer>
      )}
    </>
  );
};
