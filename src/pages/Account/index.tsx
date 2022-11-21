import React, { ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import MUIButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import Button from '@components/Button';
import { useModal } from '@components/Modal';
import { boxCreator } from '@components/boxCreator';
import AccountSecurityOption from '@components/AccountSecurityOption';

import { SendIcon } from '@assets/icons/SendIcon';
import { AwardIcon } from '@assets/icons/AwardIcon';
import { QrCodeIcon } from '@assets/icons/QrCodeIcon';

import { api } from '@lib/api';
import { useSnackbar } from '@lib/snackbar';
import { userQueryKeys } from '@lib/api/user';

import { StepLevel, useAccountLevel } from '@hooks/useAccountLevel';
import { RegisterMFASuccessCallback, useMfaFlow } from '@hooks/useMfaFlow';

import { useAuth } from '@contexts/auth';

import IconTitleStatus from './IconTitleStatus';

const Root = boxCreator({
  pb: 3,
  px: 3,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});
const Spacer = boxCreator({ flexGrow: 1 });

export const AccountPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const auth = useAuth();
  const modal = useModal();
  const theme = useTheme() as CustomTheme;

  const levelIdIconMap: Record<StepLevel, ReactNode> = {
    [StepLevel.ReceiveDigitalCurrency]: <QrCodeIcon stroke={theme.palette.primary.main} width="12px" height="12px" />,
    [StepLevel.ClaimRewards]: <AwardIcon stroke={theme.palette.primary.main} width="12px" height="12px" />,
    [StepLevel.SendDigitalCurrency]: <SendIcon stroke={theme.palette.primary.main} width="12px" height="12px" />,
  };

  const {
    data: userMFAConfigured,
    isLoading: isLoadingMFAConfigured,
    refetch: refetchUserMFAConfigured,
  } = useQuery(userQueryKeys.isMFAConfigured(), api.user.getUserMFAConfigured);
  const { completedUserLevel, steps, accountButtonProps, isLoadAccountLevelError } = useAccountLevel();

  const logout = useCallback(() => {
    auth.signOut().then(() => modal.handleClose({}, 'logout'));
  }, [auth, modal]);

  const registerMFASuccessCallback = useCallback<RegisterMFASuccessCallback>(() => {
    refetchUserMFAConfigured();
  }, [refetchUserMFAConfigured]);
  const { registerMFA } = useMfaFlow({ registerMFA: registerMFASuccessCallback });

  useEffect(() => {
    isLoadAccountLevelError && enqueueSnackbar('Can’t fetch KYC status', { variant: 'error' });
  }, [isLoadAccountLevelError]);
  return (
    <Root>
      <Typography
        variant="h1"
        color={theme.palette.text.primary}
        align="center"
        sx={{ margin: '24px 0 40px 0', fontWeight: '600' }}
      >
        Account
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color={theme.palette.text.secondary}>
          Current Account Limitations
        </Typography>
        <Typography variant="h4" color={theme.palette.text.secondary}>
          Level {completedUserLevel}
        </Typography>
      </Box>

      <Box sx={{ mt: 1.5 }}>
        {steps.map(({ levelId, status: stepStatus, heading }) => (
          <IconTitleStatus key={levelId} iconNode={levelIdIconMap[levelId]} heading={heading} status={stepStatus} />
        ))}
      </Box>

      {accountButtonProps && (
        <Button
          fullWidth
          variant="contained"
          data-testid="account-level-button"
          sx={{
            mt: 2,
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: '12px',
            lineHeight: '15px',
          }}
          onClick={() => navigate('/page/account-level')}
          {...accountButtonProps}
        ></Button>
      )}

      {Number(completedUserLevel) >= 2 && !isLoadingMFAConfigured && (
        <>
          <Typography variant="h4" color={theme.palette.text.secondary} sx={{ mt: 4 }}>
            Account Security
          </Typography>
          {/* TODO pass in status 'on' will turn on update passcode */}
          <AccountSecurityOption type="2FA" configured={userMFAConfigured} onClick={registerMFA} />
        </>
      )}
      <Spacer />
      <MUIButton
        fullWidth
        variant="contained"
        href="mailto:support@gryfyn.io"
        color="secondary"
        data-testid="contact-support-button"
        target="_blank"
        sx={{
          mt: Number(completedUserLevel) >= 2 ? 1 : 4,
          textTransform: 'capitalize',
        }}
      >
        <Typography variant="h4" color={theme.palette.text.primary} sx={{ fontWeight: '600' }}>
          Contact Support
        </Typography>
      </MUIButton>
      <Button
        fullWidth
        variant="contained"
        color="error"
        data-testid="logout-button"
        sx={{
          mt: 1,
        }}
        onClick={() => logout()}
      >
        <Typography variant="h4" color={theme.palette.text.primary} sx={{ fontWeight: '600' }}>
          Log Out
        </Typography>
      </Button>
    </Root>
  );
};
