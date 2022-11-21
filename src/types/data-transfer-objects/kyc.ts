// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Kyc {
  export enum Provider {
    SumSub = 'sumsub',
  }

  export enum IdDocSetType {
    ApplicantData = 'APPLICANT_DATA',
    Identity = 'IDENTITY',
    ProofOfResidence = 'PROOF_OF_RESIDENCE',
    Selfie = 'SELFIE',
  }

  export enum Status {
    NotStarted = 'NOT_STARTED',
    // 	Initial registration has started. A client is still in the process of filling out the applicant profile. Not all required documents are currently uploaded.
    Init = 'INIT',
    // 	An applicant is ready to be processed.
    Pending = 'PENDING',
    // 	The check is in a half way of being finished.
    PreChecked = 'PRECHECKED',
    // 	The checks have been started for the applicant.
    Queued = 'QUEUED',
    // 	Applicant waits for a final decision from compliance officer (manual check was initiated) or waits for all beneficiaries to pass KYC in case of company verification.
    OnHold = 'ON_HOLD',
    // 	The check has been completed.
    Completed = 'COMPLETED',
  }

  export enum SumsubReviewStatus {
    Init = 'init',
    Pending = 'pending',
    PreChecked = 'prechecked',
    Queue = 'queued',
    Completed = 'completed',
    OnHold = 'onHold',
  }

  export enum Result {
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    SoftRejected = 'SOFT_REJECTED',
    HardRejected = 'HARD_REJECTED',
  }

  export interface Step {
    id: number;
    name: string;
    levelId: number;
    provider: Provider;
    contentType: string; // TODO: increase strictness
  }

  export interface Level {
    id: number;
    label: string;
    description: string;
    steps: Step[];
  }

  export enum StepValidationResult {
    VALID = 'VALID',
    INVALID = 'INVALID',
    SKIPPED = 'SKIPPED',
  }

  export interface StepStatus {
    id: number;
    stepId: number;
    userId: number;
    step: Step;
    status: Status;
    lastUpdateDate: string;
    result: Result;
    createdAt: string;
    updatedAt: string;
    validationResult: StepValidationResult;
  }

  export interface FixedInfo {
    firstName: string;
    firstNameEn: string;
    middleName: string;
    middleNameEn: string;
    lastName: string;
    lastNameEn: string;
    dob: string;
    nationality: string;
  }

  export interface Review {
    reviewId: string;
    attemptId: string;
    attemptCnt: number;
    reprocessing: boolean;
    levelName: string;
    createDate: string;
    reviewStatus: string;
    priority: number;
    autoChecked: boolean;
  }

  export enum DocType {
    IdCard = 'ID_CARD',
    Passport = 'PASSPORT',
    Drivers = 'DRIVERS',
    ResidencePermit = 'RESIDENCE_PERMIT',
    UtilityBill = 'UTILITY_BILL',
  }

  // https://developers.sumsub.com/api-reference/#adding-an-id-document
  // Maps to idDocSubType
  export enum DocSide {
    Front = 'FRONT_SIDE',
    Back = 'BACK_SIDE',
  }

  export enum ReviewAnswer {
    Green = 'GREEN',
    Red = 'RED',
  }

  export enum ReviewRejectType {
    Final = 'FINAL',
    Retry = 'RETRY',
  }

  export type ImageReviewResult = Partial<{
    reviewAnswer: Kyc.ReviewAnswer;
    reviewRejectType: Kyc.ReviewRejectType;
    moderationComment: string;
    rejectLabel: string[];
  }>;

  export interface RequiredIdDocs {
    docSets: [
      {
        idDocSetType: string;
        types: Kyc.DocType[];
        // fields: Array<{
        //   name: string;
        //   required: boolean;
        // }>;
      },
    ];
    excludedCountries: string[];
  }

  export interface DocPayload {
    country: string;
    doubleSided: boolean;
    forbidden: boolean;
    idDocType: Kyc.DocType;
    // If imageIds array contains more than one element the first one would be front side and others - back sides
    imageIds: number[];
    imageReviewResults: {
      [imageId: number]: Kyc.ImageReviewResult;
    };
    reviewResult: {
      reviewAnswer: Kyc.ReviewAnswer;
    };
    stepStatuses: null;
  }

  export type Identity = Partial<DocPayload> & { requiredIdDocs: RequiredIdDocs };

  export interface DocsByCountries {
    [countryCode: string]: {
      [idDocType: string]: {
        supported: boolean;
        doubleSided?: boolean;
      };
    };
  }

  export interface IdentityDocPayload {
    IDENTITY: Identity;
    documentsByCountries?: DocsByCountries;
  }

  export interface UserStatus {
    isHardRejected: boolean;
    reviewResult: {
      comment: string | null;
      answer: Result;
    } | null;
    reviewStatus: Status;
  }

  export interface SumsubCreateApplicantPayload {
    externalUserId: string;
    email?: string;
    phone?: string;

    metadata?: Array<{ key: string; value: string }>;

    fixedInfo?: {
      firstName: string;
      lastName: string;
      dob: string;
      nationality: string;

      middleName?: string;
      placeOfBirth?: string;
      country?: string;
    };
  }
}
