import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';
import { AccountLevelItemStatus } from '@gryfyn-types/props/AccountLevelItemStatus';
import { api } from '@lib/api';
import { userQueryKeys } from '@lib/api/user';
import { ButtonProps } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKycData } from './useKycStatus';

export enum StepLevel {
  ReceiveDigitalCurrency = '1',
  ClaimRewards = '2',
  SendDigitalCurrency = '3',
}

const idDocSetLabelMap: Record<Kyc.IdDocSetType, string> = {
  [Kyc.IdDocSetType.ApplicantData]: 'Personal Information',
  [Kyc.IdDocSetType.Identity]: 'Identity Verification',
  [Kyc.IdDocSetType.ProofOfResidence]: 'Address Verification',
  [Kyc.IdDocSetType.Selfie]: 'Liveness Check',
};

const levelIdHeadingsMap: Record<StepLevel, string> = {
  [StepLevel.ReceiveDigitalCurrency]: 'Receive digital currency',
  [StepLevel.ClaimRewards]: 'Claim in-game rewards',
  [StepLevel.SendDigitalCurrency]: 'Send digital currency',
};

export enum StepStatus {
  Unlocked = 'unlocked',
  Locked = 'locked',
  VerificationInProgress = 'verification-in-progress',
  VerificationFailed = 'verification-failed',
}

interface Item {
  label: string;
  status: AccountLevelItemStatus;
}

// Use IStep due to name conflicts with Step from MUI
export interface IStep {
  levelId: StepLevel;
  status: StepStatus;
  heading: string;
  items: Item[];
}

const getStepStatus = (items: Item[]): StepStatus => {
  switch (true) {
    case items.length === 0:
      return StepStatus.Locked;

    case items.every((item) => item.status === AccountLevelItemStatus.Approved):
      return StepStatus.Unlocked;

    case items.every((item) => [AccountLevelItemStatus.Pending, AccountLevelItemStatus.Approved].includes(item.status)):
      return StepStatus.VerificationInProgress;

    case items.some((item) => item.status === 'rejected'):
      return StepStatus.VerificationFailed;

    default:
      return StepStatus.Locked;
  }
};

const DEFAULT_COMPLETED_USER_LEVEL = StepLevel.ReceiveDigitalCurrency;

export const useAccountLevel = () => {
  const navigate = useNavigate();

  const {
    data: userAccountLevel,
    isLoading: isAccountLevelLoading,
    isError: isLoadAccountLevelError,
  } = useQuery(userQueryKeys.getLevels(), api.user.getUserAccountLevel);
  const { allSteps, isLoading: isKycStatusLoading } = useKycData();
  const completedUserLevel = useMemo(
    () => userAccountLevel?.level ?? DEFAULT_COMPLETED_USER_LEVEL,
    [userAccountLevel?.level],
  );

  const getItemStatusByLevelId = useCallback(
    (id: string): AccountLevelItemStatus =>
      +completedUserLevel >= +id ? AccountLevelItemStatus.Approved : AccountLevelItemStatus.NoProgress,
    [completedUserLevel],
  );

  const levelIdStepItemsMap = useMemo<Record<StepLevel, Item[]>>(
    () => ({
      [StepLevel.ReceiveDigitalCurrency]: [
        {
          label: 'Country of residence',
          status: getItemStatusByLevelId(StepLevel.ReceiveDigitalCurrency),
        },
      ],
      [StepLevel.ClaimRewards]: allSteps.map((step) => ({
        label: idDocSetLabelMap[step.name as Kyc.IdDocSetType] ?? step.name,
        status: step.status,
      })),
      [StepLevel.SendDigitalCurrency]: [
        {
          label: 'Setup 2-Factor Authentication',
          status: getItemStatusByLevelId(StepLevel.SendDigitalCurrency),
        },
      ],
    }),
    [allSteps, getItemStatusByLevelId],
  );

  const steps = useMemo<IStep[]>(
    () =>
      Object.values(StepLevel).map((levelId) => ({
        levelId,
        heading: levelIdHeadingsMap[levelId],
        items: levelIdStepItemsMap[levelId],
        status: getStepStatus(levelIdStepItemsMap[levelId]),
      })),
    [levelIdStepItemsMap],
  );

  const accountLevelButtonProps = useMemo<ButtonProps | null>(() => {
    const kycStep = steps.find((step) => step.levelId === StepLevel.ClaimRewards)!;

    switch (true) {
      case isAccountLevelLoading || isKycStatusLoading:
        return {
          children: 'Loading...',
          disabled: true,
        };

      case userAccountLevel?.accountDisabled:
        return {
          children: 'Your account has been disabled',
          disabled: true,
        };

      case completedUserLevel === StepLevel.SendDigitalCurrency:
        return {
          children: 'Return to Account',
          color: 'secondary',
          onClick: () => {
            navigate('/account');
          },
        };

      case completedUserLevel === StepLevel.ClaimRewards &&
        kycStep.items.every(({ status }) => status === AccountLevelItemStatus.Approved):
        return {
          children: 'Setup 2FA',
          onClick: () => {
            navigate('/page/account-security');
          },
        };

      // Next Step: KYC
      case completedUserLevel === StepLevel.ReceiveDigitalCurrency ||
        kycStep.items.some(({ status }) => status !== AccountLevelItemStatus.Approved): {
        const onClick = () => navigate('/page/kyc-verification');

        switch (kycStep.status) {
          case StepStatus.Unlocked:
          case StepStatus.VerificationInProgress:
            return null;
          case StepStatus.VerificationFailed:
            return {
              children: 'Re-submit Account Verification',
              onClick,
            };
          case StepStatus.Locked: {
            return kycStep.items.some((item) => item.status === AccountLevelItemStatus.Pending)
              ? {
                  children: 'Continue',
                  onClick,
                }
              : {
                  children: 'Verify Your Account',
                  onClick,
                };
          }

          default:
            return null;
        }
      }

      default:
        return null;
    }
  }, [
    completedUserLevel,
    isAccountLevelLoading,
    isKycStatusLoading,
    navigate,
    steps,
    userAccountLevel?.accountDisabled,
  ]);

  const accountButtonProps = useMemo<ButtonProps | null>(() => {
    const kycStep = steps.find((step) => step.levelId === StepLevel.ClaimRewards)!;
    const onClick = () => {
      navigate('/page/account-level');
    };

    switch (true) {
      case isAccountLevelLoading || isKycStatusLoading:
        return {
          children: 'Loading...',
          disabled: true,
        };

      case completedUserLevel === StepLevel.SendDigitalCurrency:
        return {
          children: 'View Account Level',
          color: 'secondary',
        };

      case userAccountLevel?.accountDisabled:
        return {
          children: 'Your account has been disabled',
          disabled: true,
        };

      // Next Step: 2FA
      case completedUserLevel === StepLevel.ClaimRewards &&
        kycStep.items.every(({ status }) => status === AccountLevelItemStatus.Approved):
        return {
          children: 'Unlock Final Account Level',
          onClick,
        };

      // Next Step: KYC
      case completedUserLevel === StepLevel.ReceiveDigitalCurrency ||
        kycStep.items.some(({ status }) => status !== AccountLevelItemStatus.Approved): {
        switch (kycStep.status) {
          case StepStatus.Unlocked:
          case StepStatus.VerificationInProgress:
            return {
              children: 'Verification In Progress',
              color: 'secondary',
            };
          case StepStatus.VerificationFailed:
            return {
              children: 'Re-submit Account Verification',
              onClick,
            };
          case StepStatus.Locked:
            return {
              children: 'Unlock Next Account Level',
              onClick,
            };

          default:
            return null;
        }
      }

      default:
        return null;
    }
  }, [
    completedUserLevel,
    isAccountLevelLoading,
    isKycStatusLoading,
    navigate,
    steps,
    userAccountLevel?.accountDisabled,
  ]);

  const accountButtonKYCReminderProps = useMemo<ButtonProps | null>(() => {
    const kycStep = steps.find((step) => step.levelId === StepLevel.ClaimRewards)!;
    const onClick = () => {
      navigate('/page/account-level');
    };

    switch (true) {
      case isAccountLevelLoading || isKycStatusLoading:
        return {
          children: 'Loading...',
          disabled: true,
        };

      case completedUserLevel === StepLevel.SendDigitalCurrency:
        return {
          children: 'View Account Level',
          color: 'secondary',
        };

      case userAccountLevel?.accountDisabled:
        return {
          children: 'Your account has been disabled',
          disabled: true,
        };

      case completedUserLevel === StepLevel.ClaimRewards &&
        kycStep.items.every(({ status }) => status === AccountLevelItemStatus.Pending):
        return {
          children: 'View Account Levels',
          onClick,
        };

      case completedUserLevel === StepLevel.ClaimRewards &&
        kycStep.items.every(({ status }) => status === AccountLevelItemStatus.Rejected):
        return {
          children: 'Re-submit Account Verification',
          onClick,
        };

      // Next Step: 2FA
      case completedUserLevel === StepLevel.ClaimRewards &&
        kycStep.items.every(({ status }) => status === AccountLevelItemStatus.Approved):
        return {
          children: 'Setup 2FA',
          onClick,
        };

      // Next Step: KYC
      case completedUserLevel === StepLevel.ReceiveDigitalCurrency ||
        kycStep.items.some(({ status }) => status !== AccountLevelItemStatus.Approved): {
        switch (kycStep.status) {
          case StepStatus.Unlocked:
          case StepStatus.VerificationInProgress:
            return {
              children: 'Verification In Progress',
              color: 'secondary',
            };
          case StepStatus.VerificationFailed:
            return {
              children: 'Re-submit Account Verification',
              onClick,
            };
          case StepStatus.Locked:
            return {
              children: 'Verify Your Account',
              onClick,
            };

          default:
            return null;
        }
      }

      default:
        return null;
    }
  }, [
    completedUserLevel,
    isAccountLevelLoading,
    isKycStatusLoading,
    navigate,
    steps,
    userAccountLevel?.accountDisabled,
  ]);

  return useMemo(
    () => ({
      isLoading: isAccountLevelLoading || isKycStatusLoading,
      steps,
      isAccountDisabled: userAccountLevel?.accountDisabled ?? false,
      isAccountSetupComplete: completedUserLevel === StepLevel.SendDigitalCurrency,
      completedUserLevel,
      accountLevelButtonProps,
      accountButtonProps,
      isLoadAccountLevelError,
      accountButtonKYCReminderProps,
    }),
    [
      accountButtonProps,
      accountLevelButtonProps,
      accountButtonKYCReminderProps,
      completedUserLevel,
      isAccountLevelLoading,
      isKycStatusLoading,
      steps,
      userAccountLevel?.accountDisabled,
      isLoadAccountLevelError,
    ],
  );
};
