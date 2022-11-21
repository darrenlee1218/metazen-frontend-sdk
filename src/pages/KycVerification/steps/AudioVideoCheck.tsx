import styled from '@emotion/styled';
import { css } from '@emotion/react';
import React, { FC, useCallback } from 'react';
import SumSubWebSdk from '@sumsub/websdk-react';
import { useQuery } from '@tanstack/react-query';
import { EventPayload } from '@sumsub/websdk/types/types';
import SumsubWebSdkProps from '@sumsub/websdk-react/types/SumsubWebSdkProps';

import Typography from '@mui/material/Typography';

import { api } from '@lib/api';
import { kycQueryKeys } from '@lib/api/kyc';

import { LoadingSkeleton } from './shared/LoadingSkeleton';
import { useKycVerificationContext } from '../KycVerificationProvider';

const Root = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const sumsubStyles = css`
  :root {
    --black: #000000;
    --blue: #12abec;
    --gray-darker: #111619;
    --gray: #8a9296;
    --primary-color: #8a9296;
  }
  .loader-overlay {
    background-color: #111619 !important;
  }
  #loader {
    align-items: center;
    background-color: var(--gray-darker) !important;
    display: flex;
    height: 100vh;
    justify-content: center;
    padding: 0;
  }
  .crosshair[data-v-76daa354] {
    height: 180px;
  }
  .justify-start[data-v-7b4fe70e] {
    color: var(--gray) !important;
  }
  .iframe2.min-height {
    min-height: auto !important;
  }
  .content-wrapper {
    background-color: var(--gray-darker) !important;
  }
  p {
    font-size: 16px;
    line-height: 24px;
  }
  input {
    color: var(--black);
    font-weight: 600;
    outline: none;
  }
  section.content {
    background-color: transparent;
    color: var(--black);
    padding: 40px 40px 16px;
    box-shadow: none;
  }
  .tutorial.pad {
    padding: 0 0 60px;
  }
  .row:not(.center) {
    display: none !important;
  }
  .row.center p {
    color: var(--gray) !important;
    font-size: 11px !important;
    line-height: 13px !important;
  }
  .liveness-step {
    padding-bottom: 0 !important;
  }
  .liveness-step > .pad:not(.tutorial) {
    padding: 0 0 !important;
  }
  .media-element {
    height: 260px !important;
    margin-top: 24px !important;
  }
  .primary-hint {
    color: var(--gray) !important;
    font-size: 11px !important;
    line-height: 13px !important;
  }
  .sumsub-logo {
    display: none;
  }
  .spinner-container {
    background: var(--gray-darker) !important;
  }
  button.submit,
  button.back {
    text-transform: capitalize;
    border-radius: 3px;
    height: 40px;
    padding: 12px 0;
    font-size: 16px;
    line-height: 1;
    background-image: none !important;
    transform: none !important;
    box-shadow: none !important;
    transition: all 0.2s linear;
  }
  button.submit {
    min-width: 312px;
    background: none;
    background-color: var(--blue);
  }
  button.close {
    top: 32px !important;
  }
  .close > svg > path {
    fill: var(--gray-darker);
  }
  .round-icon {
    background-color: var(--black) !important;
    background-image: none !important;
  }
`;

interface AudioVideoCheckPayload {
  accessToken: string;
}

export const AudioVideoCheck: FC = () => {
  const { currentStep, goToNextStep } = useKycVerificationContext();
  const {
    data: stepPayload,
    isFetching,
    refetch,
  } = useQuery(kycQueryKeys.getStepPayload(currentStep!.id), async () => {
    return api.kyc.getStepPayload<AudioVideoCheckPayload>(currentStep!.id);
  });

  const handleTokenExpired = useCallback(async () => {
    const response = await refetch();
    return response.data?.accessToken ?? ''; // TODO: Should be defined, not too sure what's going on here
  }, [refetch]);

  const handleMessage = useCallback<Required<SumsubWebSdkProps>['onMessage']>(
    (type, payload) => {
      console.log({ type, payload });
      if (
        type === 'idCheck.applicantStatus' &&
        (payload as EventPayload<'idCheck.applicantStatus'>).reviewStatus === 'pending'
      ) {
        goToNextStep();
      }

      if ((type as string) === 'idCheck.applicantReviewComplete') goToNextStep();
    },
    [goToNextStep],
  );

  if (isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <Root>
      <Typography align="center" variant="h1" fontWeight={600} mb={4}>
        Audio and Video Check
      </Typography>
      {stepPayload?.accessToken && (
        <SumSubWebSdk
          accessToken={stepPayload.accessToken}
          expirationHandler={handleTokenExpired}
          config={{
            lang: 'en-EN',
            uiConf: {
              customCssStr: sumsubStyles.styles,
            },
          }}
          options={{ addViewportTag: false, adaptIframeHeight: true }}
          onMessage={handleMessage}
          onError={(error) => console.error('onError', error)}
        />
      )}
    </Root>
  );
};
