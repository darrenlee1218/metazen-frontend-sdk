import React, { forwardRef, useMemo } from 'react';

import ListItem from '@mui/material/ListItem';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

import countries from './countries.json';
import countryCodes from './country-codes.json';

type CountriesT = Record<string, { code: string; label: string }>;
const getOptionLabel = (option: string) => (countries as unknown as CountriesT)[option]?.label ?? '';

type AutoCompletePropsT = AutocompleteProps<string, false, false, false>;

interface CountrySelectorProps {
  disabled?: boolean;
  placeholder: string;
  value: AutoCompletePropsT['value']; // Country Code
  error: TextFieldProps['error'];
  helperText: TextFieldProps['helperText'];
  sx?: SxProps;
  excludedCountries?: string[];
  onBlur: TextFieldProps['onBlur'];
  onChange: (updatedCode: string | null) => void;
}

export const CountrySelector = forwardRef<HTMLInputElement, CountrySelectorProps>(
  ({ disabled, placeholder, value, sx, error, helperText, excludedCountries = [], onBlur, onChange }, ref) => {
    const excludedSet = useMemo(() => new Set<string>(excludedCountries), [excludedCountries]);

    return (
      <Autocomplete
        disabled={disabled}
        sx={{
          '.MuiAutocomplete-endAdornment': {
            top: 'calc(50% - 12px)',
            button: {
              p: 0.5,
              backgroundColor: 'unset',
            },
            svg: {
              fontSize: 16,
            },
          },
          ...sx,
        }}
        size="small"
        options={countryCodes}
        value={value}
        onChange={(_, updatedValue) => {
          onChange(updatedValue);
        }}
        renderInput={(params) => (
          <TextField
            ref={ref}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            onBlur={onBlur}
            {...params}
          />
        )}
        getOptionLabel={getOptionLabel}
        getOptionDisabled={(optionValue) => excludedSet.has(optionValue)}
        renderOption={(props, option) => (
          <ListItem {...props}>
            <Typography variant="h4">{getOptionLabel(option)}</Typography>
          </ListItem>
        )}
      />
    );
  },
);
