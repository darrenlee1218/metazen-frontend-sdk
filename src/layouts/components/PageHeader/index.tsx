import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useTheme, CustomTheme } from '@mui/material/styles';

import { getApplicationNetworkStatus } from '@redux/selector';
import { setNetworkStatus } from '@redux/reducer/networkStatus';

import LinkComponent from '@components/LinkComponent';
import CloseIconButton from '@components/CloseIconButton';

import { AppResponseStatus } from '@gryfyn-types/AppResponseStatus';
import { CONNECTION_STATUS_COLOR, CONNECTION_STATUS_TEXT } from '@constants/connectionStatus';

import * as Web3MethodMap from '@services/web3/web3-api-service/messageEventHandler/methodMap';

import TopNavImage from './TopNavImage';
import ErrorStatus from './ConnectionStatus/ErrorStatus';

interface PageHeaderProps {
  gameLogoUrl: string;
  companyIconUrl: string;
  handleClose: (event: object, reason: string) => any;
}

const PageHeader: React.FunctionComponent<PageHeaderProps> = ({ gameLogoUrl, companyIconUrl, handleClose }) => {
  const { appNetworkStatus, sourceComponent } = useSelector(getApplicationNetworkStatus);
  const [status, setStatus] = useState<string>(AppResponseStatus.success);
  const dispatch = useDispatch();
  const theme = useTheme() as CustomTheme;

  const handleCloseClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    handleClose(event, 'User click close button');
    Web3MethodMap.handleCloseWallet();
  };

  const handleRefreshClick = (): void => {
    dispatch(
      setNetworkStatus({
        appNetworkStatus: 'error',
        sourceComponent,
        forceRefresh: true,
      }),
    );
  };
  useEffect(() => {
    setStatus(appNetworkStatus);
  }, [appNetworkStatus]);

  return (
    <>
      <Box
        sx={{
          pl: '16px',
          pr: '16px',
          height: '40px',
          display: 'flex',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: status === AppResponseStatus.error ? CONNECTION_STATUS_COLOR[status] : 'transparent',
          outline: 'none',
        }}
      >
        {status === AppResponseStatus.success && (
          <>
            <Box
              sx={{
                display: 'flex',
                columnGap: '8px',
                mt: 1,
              }}
            >
              <Box>
                <TopNavImage
                  src={companyIconUrl}
                  sx={{ border: `0.5px solid ${theme.palette.colors.clickableGray}` }}
                />
              </Box>
              {gameLogoUrl && (
                <Box>
                  <TopNavImage src={gameLogoUrl} sx={{ border: `0.5px solid ${theme.palette.colors.clickableGray}` }} />
                </Box>
              )}
            </Box>
            <CloseIconButton onClick={handleCloseClick} />
          </>
        )}
        {status === AppResponseStatus.error && (
          <>
            <ErrorStatus color={CONNECTION_STATUS_COLOR[status]} message={CONNECTION_STATUS_TEXT[status]} />
            <LinkComponent
              sx={{
                textDecoration: 'underline',
                textUnderlinePosition: 'under',
                fontSize: 'small',
                cursor: 'pointer',
              }}
              onClick={handleRefreshClick}
            >
              Refresh
            </LinkComponent>
          </>
        )}
      </Box>
      <Divider sx={{ borderColor: 'colors.border' }} />
    </>
  );
};

export default PageHeader;
