import React from 'react';
import { useSelector } from 'react-redux';
import { RouteObject, useRoutes } from 'react-router-dom';

import { PageLayout } from '@layouts/PageLayout';
import PageHeader from '@layouts/components/PageHeader';
import { BottomNavigationLayout } from '@layouts/BottomNavigationLayout';

import { selectWalletConfig } from '@redux/selector';

// Tab pages
import { HomePage } from './HomePage';
import { AccountPage } from './Account';
import { GameRewards } from './GameRewards';
import { TokenDetailPage } from './TokenDetail';
import { RecentActivityPage } from './RecentActivity';
import GameCollectionDetails from './GameCollectionDetails';

// Other pages
import { SendPage } from './Send';
import { DepositPage } from './Deposit';
import { SendGameItem } from './SendGameItem';
import { PrivacyPolicyPage } from './PrivacyPolicy';
import { InGameFinishPage } from '@pages/InGameFinish';
import { InGameSigningPage } from '@pages/InGameSigning';
import { SendConfirmationPage } from './SendConfirmation';
import { SendGameCollection } from './SendGameCollection';
import GameTransactionsSign from './GameTransactionsSign';
import { GameCollectionDetail } from './GameCollectionDetail';
import { DataDeletionPolicyPage } from './DataDeletionPolicy';
import GameTransactionsApprove from './GameTransactionsApprove';
import GameTransactionsLoadingPage from './GameTransactionsLoading';
import { GameCollectionReceive } from './GameCollectionReceive';
import { KycVerification } from './KycVerification';
import { AccountLevel } from './AccountLevel';
import { InGameSignMessagePage } from './InGameSignMessage';
import { InGameSignTypedDataPage } from './InGameSignTypedData';
import { AccountSecurityPage } from './AccountSecurity';
import { AccountSecurityFinishPage } from './AccountSecurityFinish';
import { KycReminder } from './KycReminder';
import { SessionExpired } from './SessionExpired';
export const routes: RouteObject[] = [
  // tabs and related pages
  {
    path: '/',
    element: <BottomNavigationLayout />,
    children: [
      {
        index: true,
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/game-rewards',
        element: <GameRewards />,
      },
      {
        path: '/recent-activity',
        element: <RecentActivityPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
      {
        path: '/token-details/:assetKey',
        element: <TokenDetailPage />,
      },
      {
        path: '/game-collection/:assetKey',
        element: <GameCollectionDetail />,
      },
      {
        path: '/game-collection-details',
        element: <GameCollectionDetails />,
      },
    ],
  },
  {
    path: '/page',
    element: <PageLayout />,
    children: [
      { path: '/page/session-expired', element: <SessionExpired /> },
      {
        path: '/page/account-level',
        element: <AccountLevel />,
      },
      {
        path: '/page/privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: '/page/data-deletion-policy',
        element: <DataDeletionPolicyPage />,
      },
      {
        path: '/page/wallet/receive',
        element: <DepositPage />,
      },
      {
        path: '/page/wallet/send',
        element: <SendPage />,
      },
      {
        path: '/page/wallet/send/confirmation',
        element: <SendConfirmationPage />,
      },
      {
        path: '/page/kyc-verification',
        element: <KycVerification />,
      },
      {
        path: '/page/game-collection/:key/receive',
        element: <GameCollectionReceive />,
      },
      {
        path: '/page/game-collection/:key/send',
        element: <SendGameCollection />,
      },
      {
        path: '/page/game-collection/:key/items/:tokenId/send',
        element: <SendGameItem />,
      },
      {
        path: '/page/game-transactions-sign',
        element: <GameTransactionsSign />,
      },
      {
        path: '/page/game-transactions-approve',
        element: <GameTransactionsApprove />,
      },
      {
        path: '/page/game-transactions-loading',
        element: <GameTransactionsLoadingPage />,
      },
      {
        path: '/page/in-game-transactions',
        element: <InGameSigningPage />,
      },
      {
        path: '/page/in-game-sign-message',
        element: <InGameSignMessagePage />,
      },
      {
        path: '/page/in-game-sign-typed-data',
        element: <InGameSignTypedDataPage />,
      },
      {
        path: '/page/in-game-finish',
        element: <InGameFinishPage />,
      },
      {
        path: '/page/account-security',
        element: <AccountSecurityPage />,
      },
      {
        path: '/page/account-security-finish',
        element: <AccountSecurityFinishPage />,
      },
      {
        path: '/page/kyc-reminder',
        element: <KycReminder />,
      },
    ],
  },
];

export const routePaths = routes.reduce<string[]>((paths, route) => {
  return paths.concat(route.children?.map((c) => c.path ?? '') ?? []);
}, []);

interface AppRouterProps {
  onClose: () => void;
}
export const AppRouter: React.FC<AppRouterProps> = ({ onClose }) => {
  const elements = useRoutes(routes);
  const { companyIconUrl, gameIconUrl } = useSelector(selectWalletConfig);

  return (
    <>
      <PageHeader companyIconUrl={companyIconUrl} gameLogoUrl={gameIconUrl} handleClose={onClose} />
      {elements}
    </>
  );
};
