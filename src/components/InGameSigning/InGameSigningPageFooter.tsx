import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme, CustomTheme } from '@mui/material/styles';

import { InGameSigningPageFooterProps } from '@gryfyn-types/props/InGameSigningProps';

const InGameSigningPageFooter: React.FC<InGameSigningPageFooterProps> = ({
  errorMessage,
  isLoading,
  onCancel,
  onSign,
}) => {
  const theme = useTheme() as CustomTheme;

  return (
    <>
      {/* TODO: enhance error message display UI */}
      {errorMessage.length > 0 && (
        <Typography variant="h4" color={theme.palette.colors.errorPrimary}>
          {errorMessage}
        </Typography>
      )}
      <Box
        sx={{
          my: 2,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Button
          fullWidth
          color="secondary"
          disableElevation
          onClick={onCancel}
          variant="contained"
          sx={{ fontWeight: 'bold', textTransform: 'none', borderRadius: 4 }}
        >
          Cancel
        </Button>
        <LoadingButton
          fullWidth
          color="primary"
          disableElevation
          loading={isLoading}
          variant="contained"
          onClick={onSign}
          sx={{
            ml: 2,
            fontWeight: '600',
            fontSize: '16px',
            textTransform: 'none',
          }}
        >
          Sign
        </LoadingButton>
      </Box>
    </>
  );
};

export default InGameSigningPageFooter;
