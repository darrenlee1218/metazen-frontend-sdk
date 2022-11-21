import styled from '@emotion/styled';
import { css } from '@emotion/react';
import SumSubWebSdk from '@sumsub/websdk-react';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useCallback, useMemo } from 'react';
import { EventPayload } from '@sumsub/websdk/types/types';
import SumsubWebSdkProps from '@sumsub/websdk-react/types/SumsubWebSdkProps';

import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import { api } from '@lib/api';
import { kycQueryKeys } from '@lib/api/kyc';

import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

import { LoadingSkeleton } from './shared/LoadingSkeleton';
import { useKycVerificationContext } from '../KycVerificationProvider';

const Root = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const createSumsubCss = (theme: CustomTheme): ReturnType<typeof css> => css`
  body,
  section,
  .loader-overlay,
  .spinner-container,
  .content-wrapper,
  #loader {
    background: ${theme.palette.colors.appBackground} !important;
  }

  .min-height {
    min-height: unset !important;
  }

  .liveness-step {
    padding-bottom: 0 !important;
  }

  .pad {
    padding: 0 !important;
  }

  .tutorial.pad {
    padding: 0;
  }

  .tutorial.pad > .row:nth-child(1) {
    display: none;
  }

  .tutorial.pad > .row:nth-child(2) {
    margin-top: 0;
  }

  .tutorial.pad > .row:nth-child(2) p {
    color: ${theme.palette.text.secondary} !important;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
  }

  .overlay-container {
    width: 300px;
    height: 300px;
  }

  .overlay-container > * {
    min-height: unset !important;
    height: 300px !important;
  }

  .face-frame-container {
    padding-top: 0 !important;
    pointer-events: none;
  }

  p {
    color: ${theme.palette.text.secondary} !important;
  }

  video {
    width: 120px;
    height: 120px;
  }

  .sumsub-logo {
    display: none;
  }

  .controls > *:nth-child(2) {
    width: 100%;
  }

  button .button.close {
    top: 16px;
    right: 16px;
  }

  .button.close > svg {
    fill: ${theme.palette.action.active};
  }

  .controls > *:nth-child(2) > button {
    width: 100%;
    box-shadow: none !important;
    transform: none !important;
    background: ${theme.palette.primary.main} !important;
    border-radius: 4px;
    text-transform: none;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
  }

  .pad:has(.controls) > .row {
    margin-top: 60px;
  }

  button.alt-back {
    display: none;
  }

  .steps-wizard-mobile,
  .steps-wizard-mobile + * {
    display: none;
  }
`;

const WebSdkBox = styled.div`
  flex-grow: 1;
  & > *,
  & > * > iframe {
    height: 100% !important;
  }
`;

interface LivenessCheckPayload {
  accessToken: string;
}

export const LivenessCheck: FC = () => {
  const theme = useTheme() as CustomTheme;
  const { currentStep, externalUserId, goToNextStep } = useKycVerificationContext();
  const {
    data: stepPayload,
    isFetching,
    refetch,
  } = useQuery(kycQueryKeys.getStepPayload(currentStep?.id ?? null), async () => {
    return api.kyc.getStepPayload<LivenessCheckPayload>(currentStep?.id ?? 0);
  });

  const { styles: cssStr } = useMemo(() => createSumsubCss(theme), [theme]);

  const handleTokenExpired = useCallback(async () => {
    const response = await refetch();
    return response.data?.accessToken ?? ''; // TODO: Should be defined, not too sure what's going on here
  }, [refetch]);

  const handleNext = useCallback(async () => {
    await api.kyc.requestCheck({ stepId: currentStep?.id ?? 0, externalUserId: externalUserId ?? '' });
    goToNextStep();
  }, [currentStep, externalUserId, goToNextStep]);

  const handleMessage = useCallback<Required<SumsubWebSdkProps>['onMessage']>(
    (type, payload) => {
      console.log({ type, payload });
      if (
        type === 'idCheck.applicantStatus' &&
        [
          Kyc.SumsubReviewStatus.OnHold,
          Kyc.SumsubReviewStatus.Pending,
          Kyc.SumsubReviewStatus.PreChecked,
          Kyc.SumsubReviewStatus.Queue,
          Kyc.SumsubReviewStatus.Completed,
        ].includes((payload as EventPayload<'idCheck.applicantStatus'>).reviewStatus as Kyc.SumsubReviewStatus)
      ) {
        handleNext();
      }
    },
    [handleNext],
  );

  if (isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <Root>
      <Typography align="center" variant="h1" fontWeight={600} mb={2}>
        Liveness Check
      </Typography>
      <WebSdkBox>
        {stepPayload?.accessToken && (
          <SumSubWebSdk
            accessToken={stepPayload.accessToken}
            expirationHandler={handleTokenExpired}
            config={{
              lang: 'en-EN',
              uiConf: {
                customCssStr: cssStr,
                scrollIntoView: false,
              },
            }}
            options={{ addViewportTag: true, adaptIframeHeight: true }}
            onMessage={handleMessage}
            onError={(error) => console.error('onError', error)}
          />
        )}
      </WebSdkBox>
    </Root>
  );
};
