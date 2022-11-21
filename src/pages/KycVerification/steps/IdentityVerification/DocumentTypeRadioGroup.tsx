import React, { forwardRef } from 'react';

import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';

import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

const docTypeLabelMap: Record<Kyc.DocType, string> = {
  [Kyc.DocType.IdCard]: 'ID Card',
  [Kyc.DocType.Passport]: 'Passport',
  [Kyc.DocType.Drivers]: "Driver's license",
  [Kyc.DocType.ResidencePermit]: 'Residence Permit',
  [Kyc.DocType.UtilityBill]: 'Utility Bill',
};

interface DocumentTypeRadioGroupProps extends Omit<RadioGroupProps, 'sx'> {
  docTypes: Kyc.DocType[];
}

export const DocumentTypeRadioGroup = forwardRef<unknown, DocumentTypeRadioGroupProps>(
  ({ docTypes, ...radioGroupProps }, ref) => {
    if (docTypes.length === 0) return null;

    return (
      <FormControl size="small">
        <Typography variant="h4" color="text.secondary" mb={2}>
          Choose your document type
        </Typography>

        <RadioGroup
          sx={{
            '.MuiFormControlLabel-root': {
              ml: 0,
            },
            '.MuiRadio-root': {
              p: 0,
            },
            '.MuiFormControlLabel-root + .MuiFormControlLabel-root': {
              mt: 1,
            },
          }}
          ref={ref}
          {...radioGroupProps}
        >
          {docTypes.map((docType) => (
            <FormControlLabel
              key={docType}
              value={docType}
              control={<Radio size="small" />}
              label={
                <Typography variant="h4" color="text.primary" ml={1}>
                  {docTypeLabelMap[docType]}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  },
);
