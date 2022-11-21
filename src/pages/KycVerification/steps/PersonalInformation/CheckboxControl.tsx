import React, { FC, ReactNode } from 'react';
import { Box, Checkbox, CheckboxProps, FormControlLabel, FormHelperText } from '@mui/material';

interface CheckboxControlProps {
  disabled?: boolean;
  checked: boolean;
  label: ReactNode;
  gridArea: string;
  errorMessage?: string;
  onChange: CheckboxProps['onChange'];
  onBlur: CheckboxProps['onBlur'];
}

export const CheckboxControl: FC<CheckboxControlProps> = ({
  disabled,
  checked,
  label,
  gridArea,
  errorMessage,
  onChange,
  onBlur,
}) => {
  return (
    <Box sx={{ gridArea }}>
      <FormControlLabel
        sx={{
          alignItems: 'flex-start',
          '.MuiCheckbox-root': { p: 0.25, mx: 1 },
        }}
        disabled={disabled}
        control={<Checkbox size="small" onChange={onChange} onBlur={onBlur} checked={checked} />}
        label={label}
      />
      {Boolean(errorMessage) && (
        <FormHelperText sx={{ color: 'colors.errorPrimary', mx: '14px' }}>{errorMessage}</FormHelperText>
      )}
    </Box>
  );
};
