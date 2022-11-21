import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import BackNavigation from '@components/BackNavigation';

interface GameCollectionDetailsHeaderProps {
  nftTitle: string;
}

const GameCollectionDetailsHeader: React.FC<GameCollectionDetailsHeaderProps> = ({
  nftTitle = '',
}: GameCollectionDetailsHeaderProps) => {
  const navigate = useNavigate();
  const title = nftTitle || 'N/A';
  return (
    <Box
      sx={{
        height: 'min-content',
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <BackNavigation sx={{ mr: 0 }} onBackPress={() => navigate(-1)} />
        <Box
          sx={{
            flexGrow: 1,
            alignSelf: 'center',
            pr: 2,
            ml: -3,
          }}
        >
          <Tooltip title={title} arrow placement="bottom">
            <Typography
              variant="h2"
              align="center"
              color="text.primary"
              fontWeight="600"
              sx={{
                wordBreak: 'break-word',
              }}
            >
              {title}
            </Typography>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default GameCollectionDetailsHeader;
