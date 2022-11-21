import * as yup from 'yup';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, SubmitHandler, useForm, useWatch } from 'react-hook-form';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import Button from '@components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

import { api } from '@lib/api';
import { useSnackbar } from '@lib/snackbar';
import { AddDocumentParams, kycQueryKeys } from '@lib/api/kyc';
import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';

import { isNotNil } from '@utils/isNotNil';
import { useKycVerificationContext } from '@pages/KycVerification/KycVerificationProvider';

import { CountrySelector } from '../shared/CountrySelector';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { SumsubDocumentUploader } from '../shared/SumsubDocumentUploader';

const FoomRoot = styled.form`
  padding: ${({ theme }) => theme.spacing(3)};
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const examples = [
  'Utility bill (not older than 3 months)',
  'Bank statement (not older than 3 months)',
  'Lease agreement',
  "Employer's certificate for residence proof",
  'House purchase deed',
];

interface IFormData {
  country: string | null;
  docType: Kyc.DocType | null;
  document: number | null;
}

const schema = yup.object().shape({
  country: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),
  docType: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),
  document: yup.number().nullable(false).required(fieldErrorMessages.fieldIsRequired),
});

interface ProofOfResidencePayload {
  PROOF_OF_RESIDENCE?: Partial<Kyc.DocPayload> & { requiredIdDocs: Kyc.RequiredIdDocs };
}

export const AddressVerification: FC = () => {
  const { currentStep, externalUserId, goToNextStep } = useKycVerificationContext();
  const { enqueueSnackbar } = useSnackbar();
  const { control, formState, handleSubmit, reset } = useForm<IFormData>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      country: null,
      docType: Kyc.DocType.UtilityBill, // Sumsub hardcodes to UtilityBill in their SDK
      document: null,
    },
  });
  const { country: selectedCountry, document } = useWatch({ control });

  const restrictedOnChange = useCallback(
    (defaultOnChange: ControllerRenderProps['onChange']) => (data: unknown) => {
      if (document == null) defaultOnChange(data);
      else enqueueSnackbar('Please delete all existing images first.', { variant: 'error' });
    },
    [document, enqueueSnackbar],
  );

  const [rejectedIds, setRejectedIds] = useState<number[]>([]);

  const { data: stepPayload, isFetching } = useQuery(
    kycQueryKeys.getStepPayload(currentStep!.id),
    async () => {
      return api.kyc.getStepPayload<ProofOfResidencePayload>(currentStep!.id!);
    },
    {
      onSuccess: async ({ PROOF_OF_RESIDENCE }) => {
        const rejectedImageIds = Object.entries(PROOF_OF_RESIDENCE?.imageReviewResults ?? {})
          .map(([imageId, reviewResult]) => (reviewResult?.reviewAnswer === Kyc.ReviewAnswer.Red ? +imageId : null))
          .filter(isNotNil);

        const resolveImageId = (imageId: number | undefined) => {
          if (rejectedImageIds.includes(imageId ?? -1)) {
            return null;
          }

          return imageId ?? null;
        };

        reset({
          country: PROOF_OF_RESIDENCE?.country ?? null,
          docType: Kyc.DocType.UtilityBill,
          document: resolveImageId(PROOF_OF_RESIDENCE?.imageIds?.[0]),
        });

        setRejectedIds(rejectedImageIds);
      },
    },
  );

  const documentMetadata = useMemo<Omit<AddDocumentParams, 'document' | 'docSide'>>(
    () => ({
      country: selectedCountry!,
      stepId: currentStep!.id,
      docType: Kyc.DocType.UtilityBill!, // Sumsub hardcodes to UtilityBill in their SDK
      externalUserId: externalUserId!,
    }),
    [currentStep, externalUserId, selectedCountry],
  );

  const excludedCountries = useMemo<string[]>(
    () => [...(stepPayload?.PROOF_OF_RESIDENCE?.requiredIdDocs.excludedCountries ?? []), 'SGP', 'KOR'],
    [stepPayload?.PROOF_OF_RESIDENCE?.requiredIdDocs.excludedCountries],
  );

  const submitHandler = useCallback<SubmitHandler<IFormData>>(
    async (data) => {
      if (schema.isValidSync(data)) goToNextStep();
    },
    [goToNextStep],
  );

  if (isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <FoomRoot onSubmit={handleSubmit(submitHandler)}>
      <Typography align="center" variant="h1" fontWeight={600} mb={4}>
        Address Verification
      </Typography>

      <Typography variant="h3">The document must contain your full name and home address. Examples include:</Typography>
      <List sx={{ pl: 2 }}>
        {examples.map((example) => (
          <ListItem
            key={example}
            sx={{
              py: 0.5,
              px: 1,
              display: 'list-item',
              listStyle: 'outside circle',
              fontSize: 10,
            }}
          >
            <Typography variant="h4" color="text.secondary">
              {example}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Stack spacing={3} mt={1}>
        <Controller
          control={control}
          name="country"
          render={({ field, fieldState }) => (
            <CountrySelector
              placeholder="Issuing Country"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              excludedCountries={excludedCountries}
              {...field}
              onChange={restrictedOnChange(field.onChange)}
            />
          )}
        />

        {rejectedIds.map((rejectedId) => (
          <SumsubDocumentUploader
            key={rejectedId}
            error
            side={null}
            documentId={rejectedId}
            metadata={documentMetadata}
            imageReviewResult={stepPayload?.PROOF_OF_RESIDENCE?.imageReviewResults?.[rejectedId] ?? null}
            // onChange is not allowed in rejected documents
            onChange={() => {}}
          />
        ))}

        {Boolean(selectedCountry) && (
          <Controller
            control={control}
            name="document"
            render={({ field: { value, onChange } }) => (
              <SumsubDocumentUploader
                side={null}
                documentId={value}
                metadata={documentMetadata}
                imageReviewResult={stepPayload?.PROOF_OF_RESIDENCE?.imageReviewResults?.[value ?? -1] ?? null}
                onChange={onChange}
              />
            )}
          />
        )}
      </Stack>

      <Spacer />

      <Button fullWidth disabled={!formState.isValid} color="primary" variant="contained" type="submit" sx={{ mt: 4 }}>
        Continue
      </Button>
    </FoomRoot>
  );
};
