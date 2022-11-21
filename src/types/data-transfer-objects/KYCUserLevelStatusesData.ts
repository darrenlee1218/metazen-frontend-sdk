enum KYCStepStatus {
  /**
   * If there are no user step statuses
   */
  UNDETERMINED = 'UNDETERMINED',
  /**
   * If there exists rejected step
   */
  REJECTED = 'REJECTED',
  /**
   * If there are missing steps and none of the presented steps are rejected
   */
  MISSING_STEPS = 'MISSING_STEPS',
  /**
   * If all steps are approved
   */
  APPROVED = 'APPROVED',
  /**
   * If not MISSING_STEPS, REJECTED or APPROVED
   */
  PENDING = 'PENDING',
}

interface KYCUserLevelStatusesResult {
  externalUserId: string;
  levelOneStatus: KYCStepStatus;
  levelTwoStatus: KYCStepStatus;
}

interface KYCUserLevelStatusesResponse {
  result: KYCUserLevelStatusesResult;
}

export type { KYCUserLevelStatusesResult, KYCUserLevelStatusesResponse };

export { KYCStepStatus };
