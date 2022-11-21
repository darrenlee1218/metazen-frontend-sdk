import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectHomeIcon, selectTabWhitelist, selectHostName } from '@redux/selector';

import { TabProps } from '@mui/material/Tab';

import { CarIcon } from '@assets/icons/CarIcon';
import { AwardIcon } from '@assets/icons/AwardIcon';
import { ClockIcon } from '@assets/icons/ClockIcon';
import { UserIcon } from '@assets/icons/UserIcon';
import { HomeIcon } from '@assets/icons/HomeIcon';

export interface TabItem {
  id: string;
  label: string;
  value: string;
  to: string;
  isVisible: boolean;
  icon: TabProps['icon'];
}

const tabIconStyle = {
  width: '16px',
  height: '16px',
  stroke: 'currentColor',
};

export const useTabRoutes = (): TabItem[] => {
  const homeIcon = useSelector(selectHomeIcon);
  const tabWhitelist = useSelector(selectTabWhitelist);
  const hostName = useSelector(selectHostName);

  const homeIconLoad = useMemo(() => {
    if (hostName === 'gryfyn-revv') {
      return <CarIcon width="16px" height="16px" fill="currentColor" />;
    }
    return <HomeIcon width="16px" height="16px" stroke="currentColor" />;
  }, [hostName]);

  const rawTabList = useMemo<TabItem[]>(
    () => [
      {
        id: 'home-nav-button',
        label: 'Home',
        value: '/',
        to: '/',
        isVisible: true,
        icon: homeIcon ?? homeIconLoad,
      },
      {
        id: 'reward-nav-button',
        label: 'Rewards',
        value: '/game-rewards',
        to: '/game-rewards',
        isVisible: true,
        icon: <AwardIcon {...tabIconStyle} />,
      },
      {
        id: 'history-nav-button',
        label: 'History',
        value: '/recent-activity',
        to: '/recent-activity',
        isVisible: true,
        icon: <ClockIcon {...tabIconStyle} />,
      },
      {
        id: 'account-nav-button',
        label: 'Account',
        value: '/account',
        to: '/account',
        isVisible: true,
        icon: <UserIcon {...tabIconStyle} />,
      },
    ],
    [homeIcon],
  );

  const filteredTabList = useMemo(
    () =>
      rawTabList
        .filter((tabItem) => tabItem.isVisible)
        .filter((tabItem) => tabWhitelist.find((tabPath) => tabPath === tabItem.value)),
    [rawTabList, tabWhitelist],
  );

  return filteredTabList;
};
