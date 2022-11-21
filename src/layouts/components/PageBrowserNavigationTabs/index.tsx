import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CustomTheme, useTheme } from '@mui/material/styles';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import { TabItem } from '@hooks/useTabRoutes';

interface PageBrowserNavigationTabsProps {
  tabsList: TabItem[];
}

const PageBrowserNavigationTabs: React.FC<PageBrowserNavigationTabsProps> = ({ tabsList }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme() as CustomTheme;

  const resolvedTabValue = useMemo(() => {
    switch (true) {
      case pathname.startsWith('/token-details'):
      case pathname.startsWith('/game-collection'):
      case pathname.startsWith('/game-collection-details'):
        return '/';
      default:
        return pathname;
    }
  }, [pathname]);

  const bottomNavValue = tabsList.findIndex(({ to }) => {
    return to === resolvedTabValue;
  });
  return (
    <BottomNavigation
      value={bottomNavValue}
      sx={{
        px: 3,
        height: 48,
        flexShrink: 0,
        backgroundColor: theme.palette.colors.bottomNavBackground,
      }}
    >
      {tabsList.map(({ id, value, icon, label, to }) => (
        <BottomNavigationAction
          id={id}
          data-testid={id}
          key={value}
          showLabel
          sx={{
            minWidth: 'unset',
            flex: '1 1 0px',
            px: 0,
            '.MuiBottomNavigationAction-label': {
              fontSize: '10px !important', // Prevent zoom on select
              lineHeight: 9 / 8,
              mt: 0.5,
            },
          }}
          onClick={() => navigate(to)}
          icon={typeof icon === 'string' ? <img src="icon" /> : icon}
          label={label}
        />
      ))}
    </BottomNavigation>
  );
};

export default PageBrowserNavigationTabs;
