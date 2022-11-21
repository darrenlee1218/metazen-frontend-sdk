import { AccountLevelItemStatus } from '@gryfyn-types/props/AccountLevelItemStatus';
import { api } from '@lib/api';
import { kycQueryKeys } from '@lib/api/kyc';
import { useQuery } from '@tanstack/react-query';
import { keyBy } from '@utils/keyBy';
import { useMemo } from 'react';

export const useKycData = () => {
  const { data: externalUserId = null, isLoading: isLoadingUserId } = useQuery(
    kycQueryKeys.getExternalUserId(),
    api.kyc.getExternalUserId,
  );

  const { data: level, isLoading: isLoadingLevels } = useQuery(kycQueryKeys.getLevels(), api.kyc.getLevels);

  const { data: stepStatuses, isLoading: isLoadingStepStatuses } = useQuery(
    kycQueryKeys.getStepStatusesById(),
    async () => {
      return api.kyc.getStepStatusesById();
    },
    {
      enabled: Boolean(externalUserId),
    },
  );

  const itemKeyStepStatusMap = useMemo(() => keyBy(stepStatuses ?? [], 'itemKey'), [stepStatuses]);
  const idLevelMap = useMemo(() => {
    if (level == null) return {};
    return { [level.id]: level };
  }, [level]);

  const allSteps = useMemo(
    () =>
      (level?.steps ?? []).map((step) => ({
        ...step,
        status: itemKeyStepStatusMap[step.name]?.status ?? AccountLevelItemStatus.NoProgress,
      })),
    [itemKeyStepStatusMap, level?.steps],
  );

  return useMemo(
    () => ({
      idLevelMap,
      isLoading: isLoadingUserId || isLoadingLevels || isLoadingStepStatuses,
      externalUserId,
      allSteps,
    }),
    [idLevelMap, isLoadingUserId, isLoadingLevels, isLoadingStepStatuses, externalUserId, allSteps],
  );
};
