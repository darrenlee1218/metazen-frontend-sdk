import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Typography from '@mui/material/Typography';

import { boxCreator } from '@components/boxCreator';
import BackNavigation from '@components/BackNavigation';
import AccountSecurityOption from '@components/AccountSecurityOption';

import { api } from '@lib/api';
import { userQueryKeys } from '@lib/api/user';
import { RegisterMFASuccessCallback, useMfaFlow } from '@hooks/useMfaFlow';

const Root = boxCreator({
  pb: 3,
  px: 3,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

export const AccountSecurityPage = () => {
  const navigate = useNavigate();
  const {
    data: userMFAConfigured,
    refetch: refetchUserMFAConfigured,
    // isLoading: isLoadingMFAConfigured,
  } = useQuery(userQueryKeys.isMFAConfigured(), api.user.getUserMFAConfigured);

  const registerMFASuccessCallback = useCallback<RegisterMFASuccessCallback>(() => {
    refetchUserMFAConfigured();
    navigate('/page/account-security-finish', { replace: true });
  }, []);
  const { registerMFA } = useMfaFlow({ registerMFA: registerMFASuccessCallback });

  return (
    <>
      <BackNavigation label="Secure Your Account" onBackPress={() => navigate(-1)} />
      <Root>
        <Typography variant="h4" color="text.secondary" mt={1} mb={4} textAlign={'center'}>
          Complete one or more
        </Typography>
        <AccountSecurityOption configured={userMFAConfigured} type="" onClick={registerMFA} />
      </Root>
    </>
  );
};
