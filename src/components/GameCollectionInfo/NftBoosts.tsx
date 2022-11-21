import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CustomTheme, useTheme } from '@mui/material';

import CircularProgressIndicator from '../ProgressIndicator';
import { sortByTraitType } from './NftCollectionInfoHelper';
import { NftAttribute } from '@gryfyn-types/data-transfer-objects/NftCoreData';

interface InputProps {
  boosts: NftAttribute[];
}
const NftBoosts: React.FC<InputProps> = ({ boosts = [] }: InputProps) => {
  const theme = useTheme() as CustomTheme;

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Typography
        variant="h2"
        color="text.primary"
        sx={{
          fontWeight: '600',
          mb: 2,
        }}
      >
        Boosts
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        {boosts.sort(sortByTraitType).map(({ value, trait_type, max_value = 1 }) => {
          const boostsValue = parseInt(value, 10);
          const percentVal = Math.round((Number.isNaN(boostsValue) ? 0 : boostsValue / max_value) * 100);
          return (
            <Box
              key={trait_type}
              sx={{
                width: '30%',
                margin: '8px 8px 8px 0px',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <CircularProgressIndicator
                  backgroundColor={theme.palette.colors.nonClickableGray}
                  color={theme.palette.colors.primary}
                  value={percentVal}
                  sx={{
                    margin: 'auto',
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyItems: 'center',
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="400"
                  color="text.primary"
                  textAlign="center"
                  textTransform="capitalize"
                  sx={{
                    wordBreak: 'break-word',
                  }}
                >
                  {trait_type}
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  textAlign="center"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  fontWeight="400"
                >
                  {`+${value}`}
                </Typography>
              </Box>
            </Box>
          );
        })}
        {boosts.length === 0 && (
          <Typography variant="h4" color="text.secondary">
            No Data
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NftBoosts;
