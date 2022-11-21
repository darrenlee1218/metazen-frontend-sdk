import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Cancel, CheckCircle } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

import ButtonComponent from '@components/Button';
import { boxCreator } from '@components/boxCreator';

import { api } from '@lib/api';
import { kycQueryKeys } from '@lib/api/kyc';

import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

import { useKycVerificationContext } from './KycVerificationProvider';

const Root = boxCreator({
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
});

const ContentBox = boxCreator({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
});

export const KycCompletedScreen: FC = () => {
  const [refetchInterval, setRefetchInterval] = useState<number | false>(5000);

  const { data } = useQuery(
    kycQueryKeys.getUserStatus(),
    async () => {
      return api.kyc.getUserStatus();
    },
    {
      refetchInterval,
      onSuccess: ({ reviewStatus }) => {
        // Cancel refetch
        if (reviewStatus === Kyc.Status.Completed) setRefetchInterval(false);
      },
    },
  );

  const reviewCompleteContent = useMemo<
    Record<Kyc.Result, { icon: ReactNode; heading: string; description: string | null }>
  >(
    () => ({
      [Kyc.Result.Approved]: {
        icon: <CheckCircle sx={{ fontSize: 40 }} color="success" />,
        heading: 'Your KYC submission has been approved',
        description: null,
      },
      [Kyc.Result.Rejected]: {
        icon: <Cancel sx={{ fontSize: 40 }} color="error" />,
        heading: 'Your KYC submission has been rejected',
        description: data?.reviewResult?.comment ?? null,
      },
      [Kyc.Result.SoftRejected]: {
        icon: <Cancel sx={{ fontSize: 40 }} color="error" />,
        heading: 'Your KYC submission has been rejected',
        description: data?.reviewResult?.comment ?? null,
      },
      [Kyc.Result.HardRejected]: {
        icon: <Cancel sx={{ fontSize: 40 }} color="error" />,
        heading: 'Your KYC submission has been rejected',
        description: data?.reviewResult?.comment ?? null,
      },
    }),
    [data?.reviewResult?.comment],
  );

  const navigate = useNavigate();
  const handleClose = useCallback(() => {
    navigate('/page/account-level');
  }, [navigate]);

  return (
    <Root>
      <Box flexGrow={1000} />

      {data?.reviewStatus === Kyc.Status.Completed ? (
        <ContentBox>
          {reviewCompleteContent[data.reviewResult!.answer].icon}
          <Typography align="center" variant="h2" fontWeight={600} mt={8}>
            {reviewCompleteContent[data.reviewResult!.answer].heading}
          </Typography>
          <Typography align="center" variant="h4" color="text.secondary" mt={2}>
            {reviewCompleteContent[data.reviewResult!.answer].description}
          </Typography>
        </ContentBox>
      ) : (
        <ContentBox>
          <CircularProgress disableShrink />
          <Typography align="center" variant="h2" fontWeight={600} mt={8}>
            We are currently checking your data.
          </Typography>
          <Typography align="center" variant="h4" color="text.secondary" mt={2}>
            The verification status will update automatically.
          </Typography>
        </ContentBox>
      )}

      <Box flexGrow={2000} />
      <ButtonComponent fullWidth color="secondary" variant="contained" onClick={handleClose}>
        Close
      </ButtonComponent>
    </Root>
  );
};
