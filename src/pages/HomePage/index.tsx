import React, { FC, useCallback } from 'react';
import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import ImageTile from '@components/ImageTile';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

import { useSnackbar } from '@lib/snackbar';
import { StarIcon } from '@assets/icons/StarIcon';
import { GENERAL_ERROR_MESSAGE } from '@constants/error';
import { selectBrandTextSvg, selectHomeBackground, selectHostName, checkQrScanBool } from '@redux/selector';

import { tabAtom } from './atoms';
import { GameTokenList } from './GameTokenList';
import { GameCollectionList } from './GameCollectionList';
import { AssetTabItem, AssetTypeTabs } from './AssetTypeTabs';

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const theme = useTheme<CustomTheme>();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useAtom(tabAtom);

  const hostName = useSelector(selectHostName);
  const brandTextSrc = useSelector(selectBrandTextSvg);
  const backgroundSrc = useSelector(selectHomeBackground);
  const checkQrScanEnabled = useSelector(checkQrScanBool);

  // To be changed when correct address supplied by Gryfyn.io
  const handleReceive = useCallback(() => {
    navigate(`/page/game-collection/80001_GNTTM_0x4Aa0CcCf/receive`);
  }, [navigate]);

  const handleFetchError = useCallback(() => {
    enqueueSnackbar(GENERAL_ERROR_MESSAGE, { variant: 'error' });
  }, []);

  return (
    <main>
      <DefaultErrorBoundary>
        <Box
          sx={{
            width: '100%',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '360 / 118', // Design: 360W x 118H
            backgroundColor: 'grey',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 49.67%, #000000 100%)',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          ></Box>
          <ImageTile src={backgroundSrc ?? ''} sx={{ position: 'absolute', width: '100%', height: '100%' }} />

          {/*
              Treasure hunt button
            */}
          {hostName === 'gryfyn' && checkQrScanEnabled && (
            <Button
              className="treasureHuntReceive"
              variant="contained"
              sx={{
                position: 'absolute',
                backgroundColor: theme.palette.primary.main,
                bottom: '14px',
                right: '8px',
                width: { xs: '160px', md: '170px' },
                height: { xs: '28px', md: '32px' },
                borderRadius: '4px',
                zIndex: 2,
              }}
              onClick={handleReceive}
            >
              <Avatar
                sx={{
                  position: 'absolute',
                  left: { xs: '4px', md: '6px' },
                  backgroundColor: 'rgba(0,0,0,0)',
                  color: 'common.white',
                  fontSize: 8,
                  width: '12px',
                  height: '24px',
                }}
              >
                <StarIcon width="10px" height="10px" stroke="#ffcb00" fill="#ffcb00" />
              </Avatar>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  positon: 'relative',
                  top: '1px',
                  flex: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.55em', md: '0.58em' },
                  paddingLeft: '3px',
                }}
              >
                Receive Treasure Hunt NFT
              </Typography>
            </Button>
          )}

          {Boolean(brandTextSrc) && (
            <Box
              component="img"
              src={brandTextSrc}
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                zIndex: 1,
              }}
            />
          )}
        </Box>
        <Divider sx={{ backgroundColor: theme.palette.colors.border }} />

        <AssetTypeTabs value={tabValue} onTabChange={setTabValue} />
        {tabValue === AssetTabItem.GameTokens && <GameTokenList onFetchError={handleFetchError} />}
        {tabValue === AssetTabItem.GameCollections && <GameCollectionList onFetchError={handleFetchError} />}
      </DefaultErrorBoundary>
    </main>
  );
};
