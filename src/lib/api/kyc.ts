import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';
import { AccountLevelItemStatus } from '@gryfyn-types/props/AccountLevelItemStatus';
import { kycAxiosClient, kycJrpcClient } from './clients';

interface BaseStepParams {
  externalUserId: string;
  stepId: number;
}

interface SubmitPersonalInfoParams extends BaseStepParams {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string | null;
  nationality: string;

  placeOfBirth: string | null;
  phone: string | null;
  occupation: string | null;

  agreement: boolean;
}

export interface AddDocumentParams extends BaseStepParams {
  country: string;
  docType: Kyc.DocType;
  docSide: Kyc.DocSide | null;
  document: File;
}

interface AddDocumentResponse {
  uploadResult: { add: { uploadedImageId: string } };
}

interface DeleteImageParams extends BaseStepParams {
  imageIds: number[];
}

export type KycRestError = Array<{ field: string; message: string }>;

enum KycJrpcMethods {
  GenerateExternalUserId = 'mtz_kyc_generateExternalUserId',
  GetUserLevelStatuses = 'mtz_kyc_getUserLevelStatuses',
}

interface KycStepItemStatus {
  itemKey: Kyc.IdDocSetType;
  status: AccountLevelItemStatus;
}

export const kycApi = {
  getLevels: async () => {
    const response = await kycAxiosClient.getClient().get<{ levels: [Kyc.Level] }>(`/levels`);
    return response.data.levels[0];
  },

  getUserStatus: async () => {
    const { data } = await kycAxiosClient.getClient().get<Partial<Kyc.UserStatus>>(`/user/level-status`);
    return data;
  },

  getStepStatusesById: async () => {
    const response = await kycAxiosClient.getClient().get<KycStepItemStatus[]>(`/user/level-progress`);
    return response.data;
  },

  getUserLevelStatuses: async () => {
    return kycJrpcClient.request(KycJrpcMethods.GetUserLevelStatuses);
  },

  getApplicantData: async <T>(): Promise<T> => {
    const response = await kycAxiosClient.getClient().get<T>(`/user`);
    return response.data;
  },

  // Note: stepId is 1-indexed, not 0.
  getStepPayload: async <T>(stepId: number) => {
    const response = await kycAxiosClient.getClient().get<{ payload: T }>(`steps/${stepId}/step-payload`);
    return response.data.payload;
  },

  getExternalUserId: async (): Promise<string> => {
    return kycJrpcClient.request(KycJrpcMethods.GenerateExternalUserId);
  },

  submitPersonalInformation: async (params: SubmitPersonalInfoParams) => {
    const { stepId, ...body } = params;

    const response = await kycAxiosClient.getClient().patch(`/user`, body);

    return response.status < 300;
  },

  addDocument: async (params: AddDocumentParams) => {
    const { stepId, country, docType, docSide, document } = params;

    const formData = new FormData();
    formData.append('content', document);

    const metadata = JSON.stringify({
      metadata: {
        idDocType: docType,
        idDocSubType: docSide,
        country,
      },
    });
    formData.append('toAdd', metadata);

    const response = await kycAxiosClient
      .getClient()
      .patch<AddDocumentResponse>(`steps/${stepId}/step-payload`, formData, {
        enableErrorHandling: true,
        transformErrorResponse: (data) => {
          const typedData = data as Partial<{ errors: [{ message: string }] | string }>;
          if (Array.isArray(typedData?.errors)) return kycErrMessageDescriptionMap[typedData!.errors[0].message];
          return typedData?.errors ?? 'An unknown error occured while uploading your document.';
        },
      });

    return response.data.uploadResult.add.uploadedImageId;
  },

  deleteImageByIds: async (params: DeleteImageParams) => {
    const { stepId, imageIds } = params;
    await kycAxiosClient.getClient().patch(`steps/${stepId}/step-payload`, {
      toDelete: imageIds,
    });
  },

  requestCheck: async (params: BaseStepParams) => {
    const { stepId } = params;
    await kycAxiosClient.getClient().post(`steps/${stepId}/request-check`);
  },
};

// For caching, invalidation, etc.
export const kycQueryKeys = {
  getLevels: () => ['kyc', 'level'],
  getApplicantData: () => ['kyc', 'user'],
  getStepStatusesById: () => ['kyc', 'user', 'step-statuses'],
  getStepPayload: (stepId: number | null) => ['kyc', 'steps', stepId, 'step-payload'],
  getRedirectLink: () => [],
  getUserLevelStatuses: () => [KycJrpcMethods.GetUserLevelStatuses],
  getExternalUserId: () => [KycJrpcMethods.GenerateExternalUserId],
  getUserStatus: () => ['kyc', 'user', 'status'],
};

export const generatePreviewUrl = ({
  stepId,
  imageId,
}: {
  stepId: number;
  imageId: string | number | undefined;
}): string | null => {
  if (imageId == null) return null;
  return `${process.env.REACT_APP_KYC_API_URL}/steps/${stepId}/step-payload/images/${imageId}`;
};

export const kycErrMessageDescriptionMap: Record<string, string> = {
  forbiddenDocument: 'Unsupported or unacceptable type/country of document.',
  differentDocTypeOrCountry: 'Document type or country mismatches ones that was sent with metadata.',
  missingImportantInfo: 'Not all required document data can be recognized.',
  dataNotReadable: 'There is no available data to recognize from image.',
  expiredDoc: 'Document validity date is expired.',
  documentWayTooMuchOutside: 'Not all parts of the documents are visible.',
  grayscale: 'Black and white image.',
  noIdDocFacePhoto: 'Face is not clearly visible on the document.',
  screenRecapture: 'Image might be a photo of screen.',
  screenshot: 'Image is a screenshot.',
  sameSides: 'Image of the same side of document was uploaded as front and back sides.',
  badSelfie: 'Make sure that your face and the photo in the document are clearly visible.',
  dataReadability: 'Please make sure that the information in the document is easy to read.',
  inconsistentDocument: 'Please ensure that all uploaded photos are of the same document.',
  maybeExpiredDoc: 'Your document appears to be expired.',
  documentTooMuchOutside: 'Please ensure that the document completely fits the photo.',
};
