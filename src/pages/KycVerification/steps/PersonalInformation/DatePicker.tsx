import React, { Dispatch, FC, SetStateAction } from 'react';
import { Moment } from 'moment';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker, LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';

import { Collapse, IconButton } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import styled from '@emotion/styled';
import { FieldNames } from './field-names';

const DatePickerTextField = styled(TextField)`
  grid-area: ${FieldNames.Dob};
  .MuiInputAdornment-root {
    margin-right: ${({ theme }) => theme.spacing(0.5)};
    button {
      padding: 4px;
      background-color: unset;
      margin-right: -10px;
    }
    svg {
      font-size: 16px;
    }
  }
`;

interface DatePickerProps {
  disabled?: boolean;
  value: string | null;
  onChange: (date: Moment | null) => void;
  onBlur: () => void;
  errorMessage?: string;
  isExpanded: boolean;
  updateIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export const DatePicker: FC<DatePickerProps> = ({
  disabled,
  value,
  onChange,
  onBlur,
  errorMessage,
  isExpanded,
  updateIsExpanded,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        disableFuture
        disableOpenPicker
        disabled={disabled}
        value={value}
        onChange={onChange}
        inputFormat="DD/MM/YYYY"
        renderInput={(params) => (
          <Box sx={{ gridArea: FieldNames.Dob }}>
            <DatePickerTextField
              fullWidth
              size="small"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <IconButton
                    disabled={disabled}
                    size="small"
                    sx={{ fontSize: 16 }}
                    onClick={() => {
                      updateIsExpanded((curr) => !curr);
                    }}
                  >
                    <CalendarToday fontSize="inherit" />
                  </IconButton>
                ),
              }}
              onBlur={onBlur}
              error={Boolean(errorMessage)}
              helperText={errorMessage}
            />
            <Collapse in={isExpanded}>
              <StaticDatePicker
                autoFocus
                disableFuture
                displayStaticWrapperAs="desktop"
                value={value}
                onChange={onChange}
                onAccept={() => updateIsExpanded(false)}
                inputFormat="DD/MM/YYYY"
                renderInput={() => <TextField {...params} />}
              />
            </Collapse>
          </Box>
        )}
      />
    </LocalizationProvider>
  );
};
