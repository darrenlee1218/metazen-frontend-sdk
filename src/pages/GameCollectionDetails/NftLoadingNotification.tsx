import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CustomTheme, useTheme } from '@mui/material/styles';

import { getNftDetailsPageStatus } from '@redux/selector';
import { setRefreshNftDetails } from '@redux/reducer/nftDetailsStatus';

import CloseIconButton from '@components/CloseIconButton';
import LoadingIndicator from '@components/LoadingIndicator';
import GeneralBanner from '@components/Banner/GeneralBanner';

interface InputProps {
  loading: boolean;
  message?: string;
}
const NftLoadingNotification: React.FC<InputProps> = ({ loading = false, message = '' }: InputProps) => {
  const theme = useTheme() as CustomTheme;
  const { forceRefresh } = useSelector(getNftDetailsPageStatus);
  const dispatch = useDispatch();

  const resetNotification = useCallback(() => {
    dispatch(
      setRefreshNftDetails({
        forceRefresh: false,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (forceRefresh) {
      setTimeout(resetNotification, 2000);
    }
  }, [forceRefresh, dispatch, resetNotification]);

  return (
    <>
      {loading && <LoadingIndicator />}
      {forceRefresh && (
        <GeneralBanner
          onClose={resetNotification}
          message={message}
          severity="info"
          icon={<CloseIconButton onClick={() => resetNotification()} />}
          action={false}
          sx={{
            top: 0,
            left: 0,
            width: '100%',
            height: '40px',
            position: 'absolute',
            fontSize: 'small',
            backgroundColor: theme.palette.colors.clickableGrayHover,
            alignItems: 'center',
            p: 1,
          }}
        />
      )}
    </>
  );
};

export default NftLoadingNotification;
