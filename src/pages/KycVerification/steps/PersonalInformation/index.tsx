import styled from '@emotion/styled';
import moment, { Moment } from 'moment';
import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

import { api } from '@lib/api';
import { kycQueryKeys } from '@lib/api/kyc';
import { MuiAdapter } from '@lib/react-hook-form/MuiAdapter';

import Button from '@components/Button';

import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { CountrySelector } from '../shared/CountrySelector';
import { useKycVerificationContext } from '@pages/KycVerification/KycVerificationProvider';
import { FieldNames } from './field-names';
import { DatePicker } from './DatePicker';
import { CheckboxControl } from './CheckboxControl';
import { Collapse, List, ListItem, Stack } from '@mui/material';
import { schema } from './schema';

interface IFormData {
  [FieldNames.FirstName]: string;
  [FieldNames.MiddleName]: string;
  [FieldNames.LastName]: string;
  [FieldNames.Dob]: string | null; // YYYY-MM-DD
  [FieldNames.Nationality]: string;

  [FieldNames.Phone]: string | null;
  [FieldNames.PlaceOfBirth]: string | null;
  [FieldNames.Occupation]: string | null;

  [FieldNames.Agreement]: boolean;
}

interface PersonalInfoPayload extends Kyc.SumsubCreateApplicantPayload {
  requiredIdDocs: Kyc.RequiredIdDocs;
}

const FormRoot = styled.form`
  padding: ${({ theme }) => theme.spacing(3)};
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    '${FieldNames.FirstName} ${FieldNames.MiddleName}'
    '${FieldNames.LastName} ${FieldNames.LastName}'
    '${FieldNames.Dob} ${FieldNames.Dob}'
    '${FieldNames.Nationality} ${FieldNames.Nationality}'
    'conditional-fields conditional-fields'
    '${FieldNames.Agreement} ${FieldNames.Agreement}';

  gap: ${({ theme }) => theme.spacing(1.5)};
  font-size: 12px;
`;

export const PersonalInformation: FC = () => {
  const [isCalendarExpanded, setCalendarExpanded] = useState(false);

  const { currentStep, externalUserId, goToNextStep } = useKycVerificationContext();
  const [isReattempt] = useState(false);
  const { control, formState, handleSubmit, reset, setValue } = useForm<IFormData>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      [FieldNames.FirstName]: '',
      [FieldNames.MiddleName]: '',
      [FieldNames.LastName]: '',
      [FieldNames.Dob]: null,
      [FieldNames.Nationality]: '',
      [FieldNames.Agreement]: false,
    },
  });

  const dob = useWatch({ control, name: FieldNames.Dob });
  const countryCode = useWatch({ control, name: FieldNames.Nationality });
  const conditionalFields = useMemo(() => {
    const isPlaceOfBirthEnabled = ['ARE', 'BHS'].includes(countryCode);
    const isPhoneNumberEnabled = ['BHS', 'KOR', 'SGP'].includes(countryCode);
    const isOccupationEnabled = ['JPN'].includes(countryCode);

    return {
      isEnabled: false,
      [FieldNames.Phone]: isPhoneNumberEnabled,
      [FieldNames.PlaceOfBirth]: isPlaceOfBirthEnabled,
      [FieldNames.Occupation]: isOccupationEnabled,
    };
  }, [countryCode]);

  const { data: stepPayload, isFetching } = useQuery(
    kycQueryKeys.getApplicantData(),
    async () => {
      return api.kyc.getApplicantData<PersonalInfoPayload>();
    },
    {
      onSuccess: (data) => {
        if (!data.fixedInfo) return;

        const metadata = (data.metadata ?? []).reduce<Record<string, string>>((m, { key, value }) => {
          m[key.toLowerCase()] = value;
          return m;
        }, {});

        reset({
          [FieldNames.FirstName]: data.fixedInfo[FieldNames.FirstName],
          [FieldNames.MiddleName]: data.fixedInfo[FieldNames.MiddleName],
          [FieldNames.LastName]: data.fixedInfo[FieldNames.LastName],
          [FieldNames.Dob]: data.fixedInfo[FieldNames.Dob],
          [FieldNames.Nationality]: data.fixedInfo[FieldNames.Nationality],

          [FieldNames.PlaceOfBirth]: data.fixedInfo[FieldNames.PlaceOfBirth] ?? null,
          [FieldNames.Phone]: data.phone ?? null,

          [FieldNames.Occupation]: metadata[FieldNames.Occupation] ?? null,
          [FieldNames.Agreement]: true,
        });
      },
    },
  );

  const { isLoading: isMutating, mutateAsync } = useMutation(async (data: IFormData) =>
    api.kyc.submitPersonalInformation({
      stepId: currentStep!.id,
      externalUserId: externalUserId!,
      ...data,
    }),
  );

  const submitHandler = useCallback<SubmitHandler<IFormData>>(
    async (data) => {
      if (isReattempt) {
        goToNextStep();
        return;
      }

      const successful = await mutateAsync(data);
      if (successful) goToNextStep();
    },
    [goToNextStep, isReattempt, mutateAsync],
  );

  useEffect(() => {
    // Navigate to 30 years ago if no value and datePicker open
    if (isCalendarExpanded && !dob) {
      setValue(FieldNames.Dob, moment().subtract(30, 'years').format('YYYY-MM-DD'), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [dob, isCalendarExpanded, setValue]);

  if (isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <FormRoot
      onSubmit={handleSubmit(submitHandler, (errors) => {
        console.error({ errors });
      })}
    >
      <Typography align="center" variant="h1" fontWeight={600} mb={4}>
        Personal Information
      </Typography>

      <FormGrid>
        <MuiAdapter.TextField
          control={control}
          name={FieldNames.FirstName}
          getProps={({ field, fieldState }) => ({
            sx: { gridArea: FieldNames.FirstName },
            fullWidth: true,
            disabled: isReattempt,
            size: 'small',
            placeholder: 'First Name',
            error: Boolean(fieldState.error),
            helperText: fieldState.error?.message,
            ...field,
          })}
        />

        <MuiAdapter.TextField
          control={control}
          name={FieldNames.MiddleName}
          getProps={({ field, fieldState }) => ({
            sx: { gridArea: FieldNames.MiddleName },
            fullWidth: true,
            disabled: isReattempt,
            size: 'small',
            placeholder: 'Middle Name (opt)',
            error: Boolean(fieldState.error),
            helperText: fieldState.error?.message,
            ...field,
          })}
        />

        <MuiAdapter.TextField
          control={control}
          name={FieldNames.LastName}
          getProps={({ field, fieldState }) => ({
            sx: { gridArea: FieldNames.LastName },
            fullWidth: true,
            disabled: isReattempt,
            size: 'small',
            placeholder: 'Last Name',
            error: Boolean(fieldState.error),
            helperText: fieldState.error?.message,
            ...field,
          })}
        />

        <Controller
          control={control}
          name={FieldNames.Dob}
          render={({ field, fieldState }) => (
            <DatePicker
              disabled={isReattempt}
              value={field.value}
              onChange={(date: Moment | null) => {
                if (!date || !date?.isValid()) return;
                field.onChange(date.format('YYYY-MM-DD'));
              }}
              onBlur={field.onBlur}
              errorMessage={fieldState.error?.message}
              isExpanded={isCalendarExpanded}
              updateIsExpanded={setCalendarExpanded}
            />
          )}
        />

        <Controller
          control={control}
          name={FieldNames.Nationality}
          render={({ field, fieldState }) => (
            <CountrySelector
              disabled={isReattempt}
              sx={{ gridArea: FieldNames.Nationality }}
              placeholder="Nationality"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              excludedCountries={stepPayload?.requiredIdDocs.excludedCountries}
              {...field}
              onChange={(updatedCode) => {
                setValue(FieldNames.Phone, null);
                setValue(FieldNames.PlaceOfBirth, null);
                setValue(FieldNames.Occupation, null);
                field.onChange(updatedCode);
              }}
            />
          )}
        />

        <Collapse in={conditionalFields.isEnabled} sx={{ gridArea: 'conditional-fields' }}>
          <Stack spacing={1.5}>
            {conditionalFields[FieldNames.PlaceOfBirth] && (
              <MuiAdapter.TextField
                control={control}
                name={FieldNames.PlaceOfBirth}
                getProps={({ field, fieldState }) => ({
                  fullWidth: true,
                  disabled: isReattempt,
                  size: 'small',
                  placeholder: 'Place of Birth',
                  error: Boolean(fieldState.error),
                  helperText: fieldState.error?.message,
                  ...field,
                })}
              />
            )}

            {conditionalFields[FieldNames.Phone] && (
              <MuiAdapter.TextField
                control={control}
                name={FieldNames.Phone}
                getProps={({ field, fieldState }) => ({
                  fullWidth: true,
                  disabled: isReattempt,
                  size: 'small',
                  placeholder: 'Phone Number',
                  error: Boolean(fieldState.error),
                  helperText: fieldState.error?.message,
                  ...field,
                })}
              />
            )}

            {conditionalFields[FieldNames.Occupation] && (
              <MuiAdapter.TextField
                control={control}
                name={FieldNames.Occupation}
                getProps={({ field, fieldState }) => ({
                  fullWidth: true,
                  disabled: isReattempt,
                  size: 'small',
                  placeholder: 'Occupation',
                  error: Boolean(fieldState.error),
                  helperText: fieldState.error?.message,
                  ...field,
                })}
              />
            )}
          </Stack>
        </Collapse>

        <Controller
          control={control}
          name={FieldNames.Agreement}
          render={({ field, fieldState }) => (
            <CheckboxControl
              gridArea={FieldNames.Agreement}
              onChange={field.onChange}
              onBlur={field.onBlur}
              checked={field.value}
              disabled={isReattempt}
              errorMessage={fieldState?.error?.message}
              label={
                <Typography component="div" variant="h4" mt="5px">
                  By checking this box, I confirm that:
                  <List sx={{ '& > .MuiListItem-root': { px: 0, py: 0.5 }, py: 0.5 }}>
                    <ListItem>
                      <Typography variant="h4">
                        (a) I agree to the{' '}
                        <Link
                          underline="none"
                          href="https://gryfyn.io/terms-and-conditions/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link
                          underline="none"
                          href="https://gryfyn.io/privacy-policy"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Privacy Policy
                        </Link>
                        ;
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="h4">
                        (b) The purpose of registering for an account is to access the NFT purchase and storage services
                        provided by Gryfyn Wallet; and
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography variant="h4">
                        (c) All information and document(s) given by me are true, correct, complete and up-to-date and I
                        undertake to inform Gryfyn immediately of any changes in such information and documents.
                      </Typography>
                    </ListItem>
                  </List>
                </Typography>
              }
            />
          )}
        />
      </FormGrid>

      <Spacer />

      <Button
        fullWidth
        disabled={isMutating || !formState.isValid}
        color="primary"
        variant="contained"
        type="submit"
        sx={{ mt: 4 }}
      >
        Continue
      </Button>
    </FormRoot>
  );
};
