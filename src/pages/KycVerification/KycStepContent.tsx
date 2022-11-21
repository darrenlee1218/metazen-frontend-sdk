import React, { FC, useMemo } from 'react';
import { boxCreator } from '@components/boxCreator';
import { PersonalInformation } from './steps/PersonalInformation';
import { IdentityVerification } from './steps/IdentityVerification';
import { LivenessCheck } from './steps/LivenessCheck';
import { AddressVerification } from './steps/AddressVerification';
import { useKycVerificationContext } from './KycVerificationProvider';

const Root = boxCreator({
  flexGrow: 1,
  position: 'relative',
});

const stepNameComponentMap: Record<string | 'unknown', FC> = {
  APPLICANT_DATA: PersonalInformation,
  IDENTITY: IdentityVerification,
  PROOF_OF_RESIDENCE: AddressVerification,
  SELFIE: LivenessCheck,

  unknown: () => null,
};

export const KycStepContent: FC = () => {
  const { currentStep, externalUserId } = useKycVerificationContext();
  const StepComponent = useMemo(
    () => stepNameComponentMap[currentStep?.name ?? 'unknown'] ?? (() => null),
    [currentStep?.name],
  );

  if (!currentStep || !externalUserId) {
    return null;
  }

  return (
    <Root>
      <StepComponent />
    </Root>
  );
};
