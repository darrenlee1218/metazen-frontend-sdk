import React, { useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { styled, CustomTheme, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RootState } from '@redux/types';
import { selectWalletConfig, selectHostName } from '@redux/selector';
import { closeMfaModal, setMfaVerified } from '@redux/reducer/mfa';

import { api } from '@lib/api';
import { userQueryKeys } from '@lib/api/user';

import { boxCreator } from '@components/boxCreator';
import BackNavigation from '@components/BackNavigation';

import PageHeader from '@layouts/components/PageHeader';

const KeycloakIFrame = styled('iframe')`
  width: 100%;
  border: none;
  flex-grow: 1;
  margin-top: 30px;
  overflow: hidden;
`;
const DialogContent = boxCreator({
  bgcolor: 'background.paper',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});
const Content = boxCreator({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const KeycloakMFAModal: React.FC = () => {
  const dispatch = useDispatch();
  const platform = useSelector(selectHostName);
  const MFA_PAGE_URL = `${process.env.REACT_APP_METAZENS_MFA_PAGE_URL}?platform=${platform}` ?? '';
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { openModal } = useSelector((state: RootState) => state.mfa);
  const { width, height, companyIconUrl, gameIconUrl } = useSelector(selectWalletConfig);
  const theme = useTheme() as CustomTheme;

  const { data: userMFAConfigured } = useQuery(userQueryKeys.isMFAConfigured(), api.user.getUserMFAConfigured);

  const handleIFrameLoad = useCallback(() => {
    // monitor contentWindow.locationhref whether redirect to success screen
    // if yes, redirect this to done page
    if (iframeRef.current?.contentWindow?.location.href === `${location.origin}/mfa-success`) {
      // 2FA completed
      dispatch(setMfaVerified());
    }
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(closeMfaModal());
  }, [dispatch]);

  useEffect(() => {
    if (openModal) {
      // refresh the iframe once when open 2FA modal
      iframeRef.current?.contentWindow?.location.reload();
    }
  }, [openModal]);

  return (
    <Dialog
      fullScreen
      open={openModal}
      disableEscapeKeyDown
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return;

        handleClose();
      }}
      sx={{
        width,
        height,
        p: 0,
        top: '50%',
        left: '50%',
        boxShadow: 24,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <DialogContent>
        <PageHeader companyIconUrl={companyIconUrl} gameLogoUrl={gameIconUrl} handleClose={handleClose} />
        <BackNavigation onBackPress={handleClose} label={userMFAConfigured ? '' : '2-Factor Authentication'} />
        <Content>
          <KeycloakIFrame ref={iframeRef} src={MFA_PAGE_URL} allow="clipboard-write *;" onLoad={handleIFrameLoad} />
          {userMFAConfigured && (
            <Box sx={{ ml: '24px', mb: '24px' }}>
              <Typography variant="h5">If you have lost your 2FA device,</Typography>
              <Typography variant="h5">
                please contact
                <Box
                  component="a"
                  target="_blank"
                  href="mailto:support@gryfyn.io"
                  sx={{
                    paddingLeft: '4px',
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  customer support
                </Box>
              </Typography>
            </Box>
          )}
        </Content>
      </DialogContent>
    </Dialog>
  );
};
