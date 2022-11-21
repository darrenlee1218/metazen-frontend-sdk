import React from 'react';
import { Typography, Box } from '@mui/material';
import { NftAttribute } from '@gryfyn-types/data-transfer-objects/NftCoreData';
import AssetPropertyTile from '../AssetPropertyTile';
import { sortByTraitType } from './NftCollectionInfoHelper';

interface InputProps {
  properties: NftAttribute[];
}
const NftProperties: React.FC<InputProps> = ({ properties = [] }: InputProps) => (
  <Box>
    <Typography
      variant="h2"
      color="text.primary"
      fontWeight="600"
      sx={{
        mt: 4,
        mb: 2,
      }}
    >
      Properties
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      {properties.sort(sortByTraitType).map(({ value, trait_type }) => (
        <AssetPropertyTile
          key={trait_type}
          name={trait_type}
          value={value}
          sx={{
            width: '47%',
            textAlign: 'center',
          }}
        />
      ))}
      {properties.length === 0 && (
        <Typography variant="h4" color="text.secondary" fontWeight="400">
          No Data
        </Typography>
      )}
    </Box>
  </Box>
);

export default NftProperties;
