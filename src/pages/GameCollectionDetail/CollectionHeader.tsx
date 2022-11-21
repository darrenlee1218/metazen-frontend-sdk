import { useNavigate } from 'react-router-dom';
import React, { FC, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Twitter from '@mui/icons-material/Twitter';
import Language from '@mui/icons-material/Language';
import { CustomTheme, useTheme, SxProps } from '@mui/material/styles';

import { boxCreator } from '@components/boxCreator';
import BackNavigation from '@components/BackNavigation';
import { OpenSeaIcon } from '@assets/icons/OpenSeaIcon';

import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';

const HeaderDetailBox = boxCreator({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  gap: 1,
  mt: 1.5,
  alignItems: 'center',
});

const ActionBox = boxCreator({
  display: 'grid',
  gridTemplateRows: '24px 24px',
  gap: 0.5,
});

const ExternalLinkRow = boxCreator({
  display: 'flex',
  gap: 0.5,
  '> *': {
    flex: '1 1 0px',
  },
});

interface CollectionHeaderProps {
  nftCollection: TransformedNftCollection;
}

export const CollectionHeader: FC<CollectionHeaderProps> = ({ nftCollection }) => {
  const navigate = useNavigate();
  const theme = useTheme() as CustomTheme;

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleReceive = useCallback(() => {
    navigate(`/page/game-collection/${nftCollection.id}/receive`);
  }, [navigate, nftCollection.id]);

  const sx = useMemo<SxProps>(
    () => ({
      borderRadius: 3,
      padding: 1,
      backgroundColor: theme.palette.colors.clickableGray,
      svg: {
        fontSize: 12,
      },
    }),
    [theme.palette.colors.clickableGray],
  );

  return (
    <Box
      sx={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), radial-gradient(55.41% 99.54% at 50% 50%, rgba(0, 0, 0, 0) 0%, #000000 100%), url(${nftCollection.nftCollectionBackgroundImageUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100%',
        p: 2,
        flexShrink: 0,
      }}
    >
      <BackNavigation sx={{ mx: '-5px', my: 0, mt: '-5px' }} onBackPress={handleBackClick} />
      <HeaderDetailBox>
        <CardMedia image={nftCollection.iconUrl} sx={{ height: 56, width: 56, borderRadius: 3 }} />

        <Stack spacing={1}>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ overflow: 'hidden' }}
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {nftCollection.displayName}
          </Typography>
          <Typography variant="h5" data-testid="item-count">
            {nftCollection.numUniqueItems}{' '}
            <Box component="span" sx={{ color: theme.palette.text.secondary }}>
              items
            </Box>
          </Typography>
        </Stack>

        <ActionBox>
          <ExternalLinkRow>
            <Tooltip title="Website" arrow>
              <ButtonBase
                data-testid="website-redirect"
                sx={sx}
                component="a"
                href={nftCollection.externalLinks.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Language />
              </ButtonBase>
            </Tooltip>

            <Tooltip title="Twitter" arrow>
              <ButtonBase
                data-testid="twitter-redirect"
                sx={sx}
                component="a"
                href={nftCollection.externalLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </ButtonBase>
            </Tooltip>

            <Tooltip title="OpenSea" arrow>
              <ButtonBase
                data-testid="opensea-redirect"
                sx={sx}
                component="a"
                href={nftCollection.externalLinks.opensea}
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenSeaIcon />
              </ButtonBase>
            </Tooltip>
          </ExternalLinkRow>

          <ButtonBase sx={sx} onClick={handleReceive}>
            <Typography variant="h4" color="common.white">
              Receive
            </Typography>
          </ButtonBase>
        </ActionBox>
      </HeaderDetailBox>
    </Box>
  );
};
