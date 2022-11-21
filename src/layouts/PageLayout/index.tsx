import React, { FunctionComponent, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Outlet, useLocation } from 'react-router-dom';

import { SnackbarProvider } from '@lib/snackbar';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

import { ErrorListener } from './ErrorListener';

const PageLayoutRoot = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  position: relative;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  .SnackbarContainer-top {
    top: 56px !important;
  }
`;

export const PageLayout: FunctionComponent = () => {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  // auto scroll to top when pathname changed
  useEffect(() => {
    // "document.documentElement.scrollTo" is the magic for React Router Dom v6
    ref.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]);

  return (
    <PageLayoutRoot ref={ref}>
      <SnackbarProvider>
        <ErrorListener />
        <DefaultErrorBoundary>
          <Outlet />
        </DefaultErrorBoundary>
      </SnackbarProvider>
    </PageLayoutRoot>
  );
};
