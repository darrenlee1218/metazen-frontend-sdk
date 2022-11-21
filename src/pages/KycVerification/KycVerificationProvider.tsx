import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Kyc } from '@gryfyn-types/data-transfer-objects/kyc';
import { useKycData } from '@hooks/useKycStatus';
import { useNavigate } from 'react-router-dom';
import { AccountLevelItemStatus } from '@gryfyn-types/props/AccountLevelItemStatus';

export interface KycVerificationContextValue {
  externalUserId: string | null;
  currentStep: Kyc.Step | null;
  currentStepIndex: number;
  currentLevelStepIds: Array<Kyc.Step['id']>;
  isKycCompleted: boolean;
  isLoading: boolean;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export const KycVerificationContext = createContext<KycVerificationContextValue>({
  externalUserId: null,
  currentStep: null,
  currentStepIndex: -1,
  currentLevelStepIds: [],
  isKycCompleted: false,
  isLoading: true,
  goToPreviousStep: () => {},
  goToNextStep: () => {},
});

export const useKycVerificationContext = (): KycVerificationContextValue => useContext(KycVerificationContext);

export const KycVerificationProvider: FC = ({ children }) => {
  // IDs are 1-indexed
  const [currentStep, setCurrentStep] = useState<Kyc.Step | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Kyc.Level | null>(null);
  const [isKycCompleted, setIsKycCompleted] = useState(false);

  const navigate = useNavigate();
  const { allSteps, idLevelMap, externalUserId, isLoading } = useKycData();

  const currentStepIndex = useMemo(
    () => allSteps.findIndex((step) => step.id === currentStep?.id),
    [allSteps, currentStep?.id],
  );

  const navigateToStepIndex = useCallback(
    (targetIndex: number) => {
      const targetLevel = idLevelMap[allSteps[targetIndex]?.levelId] ?? null;
      const targetStep = allSteps[targetIndex] ?? null;

      setCurrentLevel(targetLevel);
      setCurrentStep(targetStep);

      if (targetLevel == null && targetStep == null) {
        setIsKycCompleted(true);
      }
    },
    [allSteps, idLevelMap],
  );

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex <= 0) navigate('/page/account-level');
    else navigateToStepIndex(currentStepIndex - 1);
  }, [currentStepIndex, navigate, navigateToStepIndex]);

  const goToNextStep = useCallback(() => {
    navigateToStepIndex(currentStepIndex + 1);
  }, [currentStepIndex, navigateToStepIndex]);

  const currentLevelStepIds = useMemo(() => currentLevel?.steps.map((step) => step.id) ?? [], [currentLevel?.steps]);

  useEffect(() => {
    if (allSteps.length === 0) return;

    const uncompletedStep = allSteps.find((step) => {
      // Finds the first element in allSteps with status: NotStarted
      return [AccountLevelItemStatus.NoProgress, AccountLevelItemStatus.Rejected].includes(step.status);
    });

    // The only way the following can be null is if the user has completed all steps
    // and is pending review
    if (uncompletedStep == null) {
      setIsKycCompleted(true);
    } else {
      setCurrentLevel(idLevelMap[uncompletedStep?.levelId ?? -1] ?? null);
      setCurrentStep(uncompletedStep ?? null);
    }
  }, [allSteps, idLevelMap, isLoading]);

  const contextValue = useMemo<KycVerificationContextValue>(
    () => ({
      externalUserId,
      currentStep,
      currentLevelStepIds,
      isKycCompleted,
      isLoading,
      currentStepIndex,
      goToPreviousStep,
      goToNextStep,
    }),
    [
      currentLevelStepIds,
      currentStep,
      currentStepIndex,
      externalUserId,
      goToNextStep,
      goToPreviousStep,
      isKycCompleted,
      isLoading,
    ],
  );

  return <KycVerificationContext.Provider value={contextValue}>{children}</KycVerificationContext.Provider>;
};
