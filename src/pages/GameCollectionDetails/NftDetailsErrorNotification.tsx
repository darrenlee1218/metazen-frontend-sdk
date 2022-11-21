import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { assetMasterApi } from '@redux/api/assetMaster';

import { setNetworkStatus } from '../../redux/reducer/networkStatus';

interface InputProps {
  isError: boolean;
  refreshComponent: boolean;
}
const NftDetailsErrorNotification: React.FC<InputProps> = ({
  isError = false,
  refreshComponent = false,
}: InputProps) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const forceRefresh = false;
    let appNetworkStatus: 'error' | 'success' = 'error';

    if (isError) {
      appNetworkStatus = 'error';
      if (refreshComponent) {
        dispatch(assetMasterApi.util.resetApiState());
      }
    } else {
      appNetworkStatus = 'success';
    }
    dispatch(
      setNetworkStatus({
        appNetworkStatus,
        forceRefresh,
        sourceComponent: '/game-collection-details',
      }),
    );
  }, [dispatch, isError, refreshComponent]);
  return <></>;
};

export default NftDetailsErrorNotification;
