import React, { FC } from 'react';

import Box from '@mui/material/Box';
import Button from '@components/Button';
import Divider from '@mui/material/Divider';
import { SxProps } from '@mui/material/styles';
import { ButtonProps } from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import Colors from '@theme/colors';

interface ProceduralFooterProps {
  isAdvanceEnabled: boolean;
  onAdvance: ButtonProps['onClick'];
  sx?: SxProps;
  isLoading?: boolean;
  cancelText?: string;
  advanceText?: string;
  buttonProps?: SxProps;
  requireDivider?: boolean;
  onCancel?: ButtonProps['onClick'];
}

/**
 *
 * @param handleCancel if provided, will render a footer with a cancel button
 */
export const ProceduralFooter: FC<ProceduralFooterProps> = ({
  sx,
  requireDivider,
  isAdvanceEnabled,
  buttonProps = {},
  isLoading = false,
  advanceText = 'Next',
  cancelText = 'Cancel',
  onCancel: handleCancel,
  onAdvance: handleAdvance,
}) => {
  return (
    <>
      {Boolean(requireDivider) && <Divider sx={{ borderColor: Colors.border }} />}
      <Box
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          gap: 1.5,
          ...sx,
        }}
      >
        {Boolean(handleCancel) && (
          <Button
            fullWidth
            color="secondary"
            variant="contained"
            onClick={handleCancel}
            sx={{
              fontWeight: '600',
              fontSize: 16,
              ...buttonProps,
            }}
          >
            {cancelText}
          </Button>
        )}
        <LoadingButton
          fullWidth
          color="primary"
          disableElevation
          variant="contained"
          loading={isLoading}
          onClick={handleAdvance}
          disabled={!isAdvanceEnabled}
          sx={{
            fontSize: 16,
            fontWeight: '600',
            textTransform: 'none',
            ...buttonProps,
          }}
        >
          {advanceText}
        </LoadingButton>
      </Box>
    </>
  );
};
