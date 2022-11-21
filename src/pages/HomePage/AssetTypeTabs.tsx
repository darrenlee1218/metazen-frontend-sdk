import React, { FC, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

export enum AssetTabItem {
  GameTokens,
  GameCollections,
}

const tabLabels: Record<AssetTabItem, string> = {
  [AssetTabItem.GameTokens]: 'Game Tokens',
  [AssetTabItem.GameCollections]: 'Collections',
};

interface AssetTypeTabsProps {
  value: AssetTabItem;
  onTabChange: (value: AssetTabItem) => void;
}

export const AssetTypeTabs: FC<AssetTypeTabsProps> = ({ value, onTabChange }) => {
  const theme = useTheme() as CustomTheme;
  const handleTabChange = useCallback(
    (_, newValue: AssetTabItem) => {
      onTabChange(newValue);
    },
    [onTabChange],
  );

  return (
    <Tabs
      variant="fullWidth"
      value={value}
      sx={{
        minHeight: 'unset',
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.colors.appBackground,
        zIndex: 2, // Override Token Icon
      }}
      onChange={handleTabChange}
    >
      {Object.values(tabLabels).map((label) => (
        <Tab
          key={label}
          sx={{
            flex: '1 1 0px',
            minHeight: 'unset',
            borderBottom: '1px solid',
            borderColor: theme.palette.colors.border,
          }}
          label={
            <Typography variant="h5" sx={{ textTransform: 'none', lineHeight: 1, fontWeight: 600 }}>
              {label}
            </Typography>
          }
        />
      ))}
    </Tabs>
  );
};
