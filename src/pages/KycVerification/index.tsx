import React, { FC, Fragment } from 'react';
import { KycCompletedScreen } from './KycCompletedScreen';
import { KycStepContent } from './KycStepContent';
import { KycStepHeader } from './KycStepHeader';
import { KycVerificationContext, KycVerificationProvider } from './KycVerificationProvider';

export const KycVerification: FC = () => {
  return (
    <KycVerificationProvider>
      <KycVerificationContext.Consumer>
        {({ isKycCompleted }) =>
          isKycCompleted ? (
            <KycCompletedScreen />
          ) : (
            <Fragment>
              <KycStepHeader />
              <KycStepContent />
            </Fragment>
          )
        }
      </KycVerificationContext.Consumer>
    </KycVerificationProvider>
  );
};
