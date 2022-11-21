import React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { CustomTheme, useTheme, CSSObject } from '@mui/material';

interface TileProps {
  name: string;
  value: string;
  sx?: CSSObject;
}

const AssetPropertyTile: React.FC<TileProps> = ({ name = '', value = '', sx = {} }) => {
  const theme = useTheme() as CustomTheme;
  return (
    <Box
      sx={{
        position: 'relative',
        p: 1,
        borderRadius: '3px',
        bgcolor: theme.palette.colors.nonClickableGray,
        cursor: 'pointer',
        ...sx,
      }}
    >
      <Tooltip
        title={name || 'NA'}
        arrow
        placement="bottom"
        componentsProps={{
          popper: {
            sx: {
              textTransform: 'uppercase',
              p: 0,
              m: 0,
            },
          },
        }}
      >
        <Typography
          variant="h5"
          color="text.secondary"
          textTransform="uppercase"
          noWrap
          overflow="hidden"
          fontWeight="400"
        >
          {name || 'N/A'}
        </Typography>
      </Tooltip>
      <Tooltip
        title={value || 'NA'}
        arrow
        placement="bottom"
        componentsProps={{
          popper: {
            sx: {
              textTransform: 'capitalize',
              p: 0,
              m: 0,
            },
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="400"
          color="text.primary"
          textTransform="capitalize"
          noWrap
          overflow="hidden"
          mt="8px"
        >
          {value || 'N/A'}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default AssetPropertyTile;
