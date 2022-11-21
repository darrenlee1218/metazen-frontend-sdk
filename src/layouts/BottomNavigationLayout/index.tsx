import React, { FunctionComponent } from 'react';

import { PageLayout } from '@layouts/PageLayout';
import PageBrowserNavigationTabs from '@layouts/components/PageBrowserNavigationTabs';

import { useTabRoutes } from '@hooks/useTabRoutes';

export const BottomNavigationLayout: FunctionComponent = () => {
  const tabList = useTabRoutes();

  return (
    <>
      <PageLayout />
      <PageBrowserNavigationTabs tabsList={tabList} />
    </>
  );
};
