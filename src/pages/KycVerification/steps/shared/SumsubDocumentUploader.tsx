import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { Accept, useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip, { ChipProps } from '@mui/material/Chip';
import { CustomTheme, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { DeleteRounded, UploadFileRounded } from '@mui/icons-material';

import { api } from '@lib/api';
import { useSnackbar } from '@lib/snackbar';
import { AddDocumentParams, generatePreviewUrl } from '@lib/api/kyc';

import { assertNever } from '@utils/assertNever';
import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';

import { FallbackImage } from '@components/FallbackImage';

import defaultFallbackSrc from '@assets/images/default-fallback.png';

import { useKycVerificationContext } from '../../KycVerificationProvider';

const RootBorder = styled.div<{ isError: boolean }>`
  border: 1px solid
    ${({ theme, isError }) => (isError ? theme.palette.colors.errorPrimary : theme.palette.text.secondary)};
  border-radius: 4px;
  color: ${({ theme }) => theme.palette.text.secondary};
  overflow: hidden;
`;

const Root = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  align-items: center;

  overflow: hidden;
`;

const ReviewAnswerBox = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};

  & > * + * {
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
`;

const getUploadPrompt = (docSide: Kyc.DocSide | null): string => {
  switch (docSide) {
    case Kyc.DocSide.Front:
      return 'Upload the front of your document';
    case Kyc.DocSide.Back:
      return 'Upload the back of your document';
    case null:
      return 'Upload your document';
    default:
      throw assertNever(docSide);
  }
};

interface SumsubDocumentUploaderProps {
  side: Kyc.DocSide | null;
  accept?: string[];
  documentId: number | null;
  metadata: Omit<AddDocumentParams, 'document' | 'docSide'>;
  imageReviewResult: Kyc.ImageReviewResult | null;
  error?: boolean;
  onChange: (updatedDocumentId: number | null) => void;
}

const sumsubAcceptedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];
const reviewAnswerLabelMap: Record<
  Kyc.ReviewAnswer,
  {
    label: string;
    color: ChipProps['color'];
  }
> = {
  [Kyc.ReviewAnswer.Green]: {
    label: 'Approved',
    color: 'success',
  },
  [Kyc.ReviewAnswer.Red]: {
    label: 'Rejected',
    color: 'error',
  },
};

export const SumsubDocumentUploader: FC<SumsubDocumentUploaderProps> = ({
  side,
  accept = sumsubAcceptedMimeTypes,
  documentId,
  metadata,
  imageReviewResult,
  error = false,
  onChange,
}) => {
  const theme = useTheme() as CustomTheme;
  const [localFile, setLocalFile] = useState<File | null>(null);
  const { currentStep, externalUserId } = useKycVerificationContext();
  const { enqueueSnackbar } = useSnackbar();

  const isEditable = useMemo(
    () => imageReviewResult?.reviewAnswer !== Kyc.ReviewAnswer.Red,
    [imageReviewResult?.reviewAnswer],
  );

  const { isLoading: isUploading, mutateAsync: uploadDocument } = useMutation(
    async (file: File) => {
      if (file instanceof File) {
        return api.kyc.addDocument({
          ...metadata,
          docSide: side,
          document: file,
        });
      }
    },
    {
      onSuccess: (updatedId) => {
        onChange(Number(updatedId));
        setLocalFile(null);
      },
      onError: () => {
        setLocalFile(null);
      },
    },
  );

  const { isLoading: isDeleting, mutateAsync: deleteDocumentById } = useMutation(
    async (imageId: number) => {
      return api.kyc.deleteImageByIds({
        stepId: currentStep?.id ?? 0,
        externalUserId: externalUserId ?? '',
        imageIds: [imageId],
      });
    },
    {
      onSuccess: () => {
        onChange(null);
        setLocalFile(null);
      },
    },
  );

  const fileUrl = useMemo((): string | undefined => {
    if (documentId != null) return generatePreviewUrl({ stepId: currentStep?.id ?? 0, imageId: documentId }) ?? '';
    if (localFile) return URL.createObjectURL(localFile);
    return undefined;
  }, [currentStep, documentId, localFile]);

  const handleDocumentFileChange = useCallback(
    async (file: File | null) => {
      setLocalFile(file);

      if (file) {
        await uploadDocument(file);
      }
    },
    [uploadDocument],
  );

  const handleDrop = useCallback(
    async (files: File[]) => {
      if (files.length <= 0) return;
      if (files.length > 1)
        enqueueSnackbar('More than 1 file received, only the first file will be accepted', { variant: 'info' });

      const file = files[0];
      if (accept.includes(file.type)) await handleDocumentFileChange(file);
      else enqueueSnackbar(`Only ${accept.join(', ')} are accepted`, { variant: 'error' });
    },
    [accept, enqueueSnackbar, handleDocumentFileChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: accept.reduce<Accept>((res, mimeType) => {
      res[mimeType] = [];
      return res;
    }, {}),
  });

  const handleDelete = useCallback(async () => {
    // If document.id is null, image is only in local
    if (documentId != null) {
      await deleteDocumentById(documentId);
    }

    handleDocumentFileChange(null);
  }, [deleteDocumentById, documentId, handleDocumentFileChange]);

  const inputProps = useMemo(() => {
    const { onClick, ...propsWithoutOnClick } = getInputProps();
    return propsWithoutOnClick;
  }, [getInputProps]);

  const isDisabled = isDeleting || isUploading;

  if (fileUrl) {
    return (
      <RootBorder isError={error}>
        <Root>
          <FallbackImage sx={{ width: '100%', height: 'auto' }} src={fileUrl} fallbackSrc={defaultFallbackSrc} />
          {isEditable && (
            <IconButton
              color="error"
              data-testid="document-delete-icon-button"
              disabled={isDisabled}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: `${theme.palette.primary.main} !important`,
                color: `${theme.palette.common.white} !important`,
              }}
              onClick={handleDelete}
            >
              {isDisabled ? (
                <CircularProgress disableShrink color="inherit" size={24} />
              ) : (
                <DeleteRounded color="inherit" />
              )}
            </IconButton>
          )}
        </Root>
        {imageReviewResult?.reviewAnswer && (
          <ReviewAnswerBox>
            <Chip
              variant="outlined"
              color={reviewAnswerLabelMap[imageReviewResult.reviewAnswer].color}
              label={
                <Typography variant="h4" fontWeight={600}>
                  {reviewAnswerLabelMap[imageReviewResult.reviewAnswer].label}
                </Typography>
              }
            />
            {imageReviewResult.moderationComment && (
              <Typography variant="h4" color="text.secondary">
                {imageReviewResult.moderationComment}
              </Typography>
            )}
          </ReviewAnswerBox>
        )}
      </RootBorder>
    );
  }

  return (
    <RootBorder isError={error}>
      <Root py={3} {...getRootProps()}>
        <IconButton
          component="label"
          onClick={(e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
            e.stopPropagation();
          }}
        >
          <UploadFileRounded />
          <input hidden {...inputProps} />
        </IconButton>

        <Typography variant="h4" color="inherit">
          {getUploadPrompt(side)}
        </Typography>
      </Root>
    </RootBorder>
  );
};
