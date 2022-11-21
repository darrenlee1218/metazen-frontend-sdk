import * as yup from 'yup';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Controller, ControllerRenderProps, SubmitHandler, useForm, useWatch } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Button from '@components/Button';

import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

import { api } from '@lib/api';
import { useSnackbar } from '@lib/snackbar';
import { AddDocumentParams, kycQueryKeys } from '@lib/api/kyc';
import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';

import { isNotNil } from '@utils/isNotNil';
import { yupResolver } from '@hookform/resolvers/yup';
import { useKycVerificationContext } from '@pages/KycVerification/KycVerificationProvider';

import docsByCountries from './docs-by-countries.json';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { CountrySelector } from '../shared/CountrySelector';
import { PhotoRecommendations } from './PhotoRecommendations';
import { DocumentTypeRadioGroup } from './DocumentTypeRadioGroup';
import { SumsubDocumentUploader } from '../shared/SumsubDocumentUploader';

type DocsByCountriesT = Record<
  string,
  Partial<
    Record<
      string,
      {
        supported: boolean;
        doubleSided: boolean;
      }
    >
  >
>;

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

type DocumentId = number | null;

interface IFormData {
  country: string | null;
  docType: Kyc.DocType | null;
  // Front and Back side
  documents: [DocumentId, DocumentId];
}

interface IdentityDocPayload {
  IDENTITY?: Partial<Kyc.DocPayload> & { requiredIdDocs: Kyc.RequiredIdDocs };
}

const schema = yup.object().shape({
  country: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),
  docType: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),
  documents: yup
    .array()
    .of(yup.number().nullable())
    .test('Document Uploaded', 'Not all required documents has been uploaded', (value, context) => {
      const { country, docType } = context.parent as Pick<IFormData, 'country' | 'docType'>;

      if ((docsByCountries as DocsByCountriesT)[String(country)]?.[String(docType)]?.doubleSided) {
        return value?.every(isNotNil) ?? false;
      }

      return isNotNil(value?.[0]);
    }),
});

export const IdentityVerification: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { currentStep, externalUserId, goToNextStep } = useKycVerificationContext();
  const { control, formState, handleSubmit, reset } = useForm<IFormData>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      country: null,
      docType: null,
      documents: [null, null],
    },
  });

  const documents = useWatch({ control, name: 'documents' });
  const restrictedOnChange = useCallback(
    (defaultOnChange: ControllerRenderProps['onChange']) => (data: unknown) => {
      if ((documents ?? []).every((documentId) => documentId === null)) defaultOnChange(data);
      else enqueueSnackbar('Please delete all existing images first.', { variant: 'error' });
    },
    [documents, enqueueSnackbar],
  );

  const [rejectedIds, setRejectedIds] = useState<number[]>([]);

  const { data: stepPayload, isFetching } = useQuery(
    kycQueryKeys.getStepPayload(currentStep!.id),
    async () => {
      return api.kyc.getStepPayload<IdentityDocPayload>(currentStep!.id);
    },
    {
      onSuccess: async ({ IDENTITY }) => {
        const rejectedImageIds = Object.entries(IDENTITY?.imageReviewResults ?? {})
          .map(([imageId, reviewResult]) => (reviewResult?.reviewAnswer === Kyc.ReviewAnswer.Red ? +imageId : null))
          .filter(isNotNil);

        const resolveImageId = (imageId: number | undefined) => {
          if (rejectedImageIds.includes(imageId ?? -1)) {
            return null;
          }

          return imageId ?? null;
        };

        reset({
          country: IDENTITY?.country ?? null,
          docType: IDENTITY?.idDocType ?? null,
          documents: [resolveImageId(IDENTITY?.imageIds?.[0]), resolveImageId(IDENTITY?.imageIds?.[1])],
        });

        setRejectedIds(rejectedImageIds);
      },
    },
  );

  const { country: selectedCountry, docType: selectedDocType } = useWatch({ control });
  const countryDocMetadata = useMemo(
    () => (docsByCountries as unknown as DocsByCountriesT)[String(selectedCountry)] ?? {},
    [selectedCountry],
  );

  const supportedDocTypes = useMemo(() => {
    const requiredDocTypes = stepPayload?.IDENTITY?.requiredIdDocs.docSets.flatMap(({ types }) => types) ?? [];
    return requiredDocTypes.filter((docType) => countryDocMetadata[docType]?.supported);
  }, [countryDocMetadata, stepPayload?.IDENTITY?.requiredIdDocs.docSets]);

  const documentMetadata = useMemo<Omit<AddDocumentParams, 'document' | 'docSide'>>(
    () => ({
      country: selectedCountry!,
      stepId: currentStep!.id,
      docType: selectedDocType!,
      externalUserId: externalUserId!,
    }),
    [currentStep, externalUserId, selectedCountry, selectedDocType],
  );

  const submitHandler = useCallback<SubmitHandler<IFormData>>(
    async (data) => {
      if (schema.isValidSync(data)) goToNextStep();
    },
    [goToNextStep],
  );

  const isApplicantActionRequired = useMemo(
    () =>
      documents.some(
        (documentId) =>
          stepPayload?.IDENTITY?.imageReviewResults?.[documentId ?? -1]?.reviewAnswer === Kyc.ReviewAnswer.Red,
      ),
    [documents, stepPayload?.IDENTITY?.imageReviewResults],
  );

  if (isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <FormRoot onSubmit={handleSubmit(submitHandler)}>
      <Typography align="center" variant="h1" fontWeight={600} mb={4}>
        Verify Identity Document
      </Typography>

      <Stack spacing={3}>
        <Controller
          control={control}
          name="country"
          render={({ field, fieldState }) => (
            <CountrySelector
              placeholder="Issuing Country"
              excludedCountries={stepPayload?.IDENTITY?.requiredIdDocs.excludedCountries}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              {...field}
              onChange={restrictedOnChange(field.onChange)}
            />
          )}
        />

        <Controller
          control={control}
          name="docType"
          render={({ field }) => (
            <DocumentTypeRadioGroup
              docTypes={supportedDocTypes}
              {...field}
              onChange={restrictedOnChange(field.onChange)}
            />
          )}
        />

        <PhotoRecommendations />

        {Boolean(selectedCountry && selectedDocType) && (
          <Stack spacing={1.5}>
            {rejectedIds.map((rejectedId) => (
              <SumsubDocumentUploader
                key={rejectedId}
                error
                side={null}
                documentId={rejectedId}
                metadata={documentMetadata}
                imageReviewResult={stepPayload?.IDENTITY?.imageReviewResults?.[rejectedId] ?? null}
                // onChange is not allowed in rejected documents
                onChange={() => {}}
              />
            ))}

            <Controller
              control={control}
              name="documents.0"
              render={({ field: { value, onChange } }) => (
                <SumsubDocumentUploader
                  side={countryDocMetadata[selectedDocType!]?.doubleSided ? Kyc.DocSide.Front : null}
                  documentId={value}
                  metadata={documentMetadata}
                  imageReviewResult={stepPayload?.IDENTITY?.imageReviewResults?.[value ?? -1] ?? null}
                  onChange={onChange}
                />
              )}
            />

            {(documents?.[1] != null || countryDocMetadata[selectedDocType!]?.doubleSided) && (
              <Controller
                control={control}
                name="documents.1"
                render={({ field: { value, onChange } }) => (
                  <SumsubDocumentUploader
                    side={Kyc.DocSide.Back}
                    documentId={value}
                    metadata={documentMetadata}
                    imageReviewResult={stepPayload?.IDENTITY?.imageReviewResults?.[value ?? -1] ?? null}
                    onChange={onChange}
                  />
                )}
              />
            )}
          </Stack>
        )}
      </Stack>

      <Spacer />

      <Button
        fullWidth
        disabled={!formState.isValid || isApplicantActionRequired}
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
