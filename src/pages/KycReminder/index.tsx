import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import BackNavigation from '@components/BackNavigation';
import { boxCreator } from '@components/boxCreator';
import ButtonComponent from '@components/Button';
import { Description } from '@components/Description';
import { Step, Stepper } from '@mui/material';
import { useKycData } from '@hooks/useKycStatus';
import { useAccountLevel, StepLevel } from '@hooks/useAccountLevel';
import { AccountStep } from '@pages/AccountLevel/AccountStep';

const Footer = boxCreator({
  px: 3,
  py: 2,
  position: 'sticky',
  bottom: 0,
  backgroundColor: (theme) => theme.palette.colors.appBackground,
  borderTop: (theme) => `1px solid ${theme.palette.colors.border}`,
});

const levelIdHeadingsMap = {
  VerifyAccount: 'Verify your account',
  SetupPasscode: 'Setup 2FA',
};

const levelDescription = {
  VerifyAccountDescription:
    'The verification process takes about 10mins to complete. 90% of users got approved within 24 hours after submission',
  SetupPasscodeDescription:
    'Provide an extra layer of protection to ensure the security of your account, beyond just an email and password',
};

export const KycReminder: FC = () => {
  const navigate = useNavigate();
  const { steps, accountButtonProps, accountButtonKYCReminderProps } = useAccountLevel();
  const { allSteps, isLoading: isKycStatusLoading } = useKycData();

  return (
    <>
      <BackNavigation label="Send" onBackPress={() => navigate(-1)} />
      <Description description="In order to initiate transactions you will need to complete the following 2 steps" />
      <Stepper
        orientation="vertical"
        sx={{
          px: 2,
          '.MuiStepContent-root': {
            ml: '20px',
          },
          flexGrow: '1',
        }}
        connector={null}
      >
        <AccountStep
          heading={levelIdHeadingsMap.VerifyAccount}
          levelId={steps[1].levelId}
          items={steps[1].items}
          description={levelDescription.VerifyAccountDescription}
          status={steps[1].status}
          fromKycReminder
        />

        <AccountStep
          heading={levelIdHeadingsMap.SetupPasscode}
          levelId={steps[2].levelId}
          items={steps[2].items}
          description={levelDescription.SetupPasscodeDescription}
          status={steps[2].status}
          fromKycReminder
        />
      </Stepper>
      {accountButtonKYCReminderProps && (
        <Footer>
          <ButtonComponent
            fullWidth
            color="primary"
            variant="contained"
            data-testid="account-level-action-button"
            {...accountButtonKYCReminderProps}
          />
        </Footer>
      )}
    </>
  );
};
