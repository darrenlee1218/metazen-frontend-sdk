import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowBack } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Button from '@components/Button';
import { boxCreator } from '@components/boxCreator';

import { KycStepIndicator } from './KycStepIndicator';
import { useKycVerificationContext } from './KycVerificationProvider';

const Root = boxCreator({
  pt: 1,
  px: 2,
  pb: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const IndicatorBox = boxCreator({
  display: 'flex',
  gap: 1,
});

export const KycStepHeader: FC = () => {
  const navigate = useNavigate();
  const { currentStep, currentLevelStepIds, goToPreviousStep } = useKycVerificationContext();

  const handleCancel = useCallback(() => {
    navigate('/page/account-level');
  }, [navigate]);

  return (
    <Root>
      <IconButton
        size="small"
        // Cancel Button Width - Size of IconButton
        sx={{ ml: '-5px', fontSize: 16, mr: '38px' }}
        onClick={goToPreviousStep}
      >
        <ArrowBack fontSize="inherit" />
      </IconButton>

      <IndicatorBox>
        {currentLevelStepIds.map((id) => (
          <KycStepIndicator key={id} isSelected={currentStep?.id === id} />
        ))}
      </IndicatorBox>

      <Button sx={{ mr: '-8px' }} onClick={handleCancel}>
        <Typography color="text.secondary" variant="h4">
          Cancel
        </Typography>
      </Button>
    </Root>
  );
};
