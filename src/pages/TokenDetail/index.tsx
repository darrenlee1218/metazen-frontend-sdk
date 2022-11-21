import React, { useEffect, useMemo, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import styled from '@mui/system/styled';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material/styles';

import { Dropdown } from '@components/Dropdown';
import { boxCreator } from '@components/boxCreator';
import BackNavigation from '@components/BackNavigation';
import { TokenValueDisplay } from '@components/TokenValueDisplay';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import { TokenDisplayRowSkeleton } from '@components/TokenDisplayRow/TokenDisplayRowSkeleton';

import { useTokenBalances } from '@hooks/useTokenBalances';
import { useTransactionHistory } from '@hooks/useTransactionHistory';

import { SkeletonItem } from '@pages/RecentActivity/SkeletonItem';
import { SingleListItem } from '@pages/RecentActivity/SingleListItem';

import { useSnackbar } from '@lib/snackbar';
import { ACTION_LIST } from '@constants/recentActivityFilter';
import { getUserAccountLevel } from '@services/APIServices/user-service';
import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';

import SendReceiveActionsBar from './SendReceiveActionsBar';

const RecentActivityFilter = boxCreator({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '8px 24px 16px',
});

const LoadingText = styled(Typography)({
  marginTop: '34px',
  marginHorizontal: 'auto',
  color: 'text.primary',
});

export const TokenDetailPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { allTokenBalances, isLoadBalanceError } = useTokenBalances();
  const [actionFilter, setActionFilter] = useState('');
  const { assetKey } = useParams<{ assetKey: string }>();
  const theme = useTheme() as CustomTheme;
  const [errorMessage] = useState<string>('');

  const tokenBalance = useMemo(
    () => allTokenBalances.find((tb) => tb.token.key === assetKey),
    [assetKey, allTokenBalances],
  );

  const {
    recentHistoryData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isError: isLoadTransactionError,
  } = useTransactionHistory(10, undefined, assetKey);

  const list = useMemo(() => {
    return recentHistoryData?.pages?.filter((recentActivity: RecentActivityItemProps) => {
      let isMatchAction = true;
      const isMatchAsset = recentActivity.assetName === tokenBalance?.token.ticker;
      if (actionFilter) {
        isMatchAction = recentActivity.depositOrWithdrawal.endsWith(actionFilter);
      }
      return isMatchAsset && isMatchAction;
    });
    // Sort time decending
  }, [recentHistoryData, tokenBalance?.token.ticker, actionFilter]);

  const checkAccountLevel = async () => {
    try {
      const level = await getUserAccountLevel();
      parseInt(level) > 2
        ? navigate('/page/wallet/send', {
            replace: true,
            state: { data: { token: tokenBalance?.token, tokenBalance } },
          })
        : navigate('/page/kyc-reminder');
    } catch (err: unknown) {
      enqueueSnackbar('Unable to fetch KYC status', { variant: 'error' });
    }
  };

  useEffect(() => {
    isLoadTransactionError && enqueueSnackbar('Can’t fetch tx-history', { variant: 'error' });
    isLoadBalanceError && enqueueSnackbar('Can’t fetch token balance', { variant: 'error' });
  }, [isLoadTransactionError, isLoadBalanceError]);

  if (!tokenBalance) return null;

  return (
    <main>
      <DefaultErrorBoundary>
        <BackNavigation
          label={tokenBalance.token.displayName}
          onBackPress={() => {
            navigate(-1);
          }}
        />
        {/* Token balance */}
        <Box sx={{ marginTop: '16px', marginBottom: '16px' }}>
          <TokenValueDisplay.Amount
            align="center"
            color="text.primary"
            variant="h1"
            fontWeight={600}
            token={tokenBalance.token}
            amount={tokenBalance.balanceInAssetDecimals}
            precision="display"
          />
          {tokenBalance.price && (
            <TokenValueDisplay.Currency
              token={tokenBalance.token}
              pricePerAssetInUsd={tokenBalance.price}
              amount={tokenBalance.balanceInAssetDecimals}
              align="center"
              color="text.secondary"
              variant="h4"
            />
          )}
        </Box>

        {/* Send and Receive button */}
        <SendReceiveActionsBar
          canSend={Number(tokenBalance.amount) > 0}
          onReceiveClick={() =>
            navigate('/page/wallet/receive', {
              state: { data: tokenBalance },
            })
          }
          onSendClick={checkAccountLevel}
        />
        {errorMessage.length > 0 && (
          <Typography variant="h4" color={theme.palette.colors.errorPrimary}>
            {errorMessage}
          </Typography>
        )}

        {/* Recent activities and filer */}
        <RecentActivityFilter>
          <Typography variant="h4" color="text.secondary">
            Recent Activity
          </Typography>
          <Dropdown list={ACTION_LIST} onChange={setActionFilter} value={actionFilter} />
        </RecentActivityFilter>
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} sx={{ marginLeft: '24px', marginRight: '24px', marginTop: 2, marginBottom: 2 }}>
                <TokenDisplayRowSkeleton />
              </Box>
            ))}
          </>
        ) : list && list.length > 0 ? (
          list.map((item: RecentActivityItemProps) => {
            return (
              <List sx={{ bgcolor: 'background.paper', marginLeft: '16px', marginRight: '16px' }} key={item.id}>
                <SingleListItem data={item} />
              </List>
            );
          })
        ) : (
          <>
            <LoadingText variant="h5" align="center">
              Latest transactions will appear here.
            </LoadingText>
          </>
        )}
        {hasNextPage && (
          <InView
            as="div"
            onChange={(inView) => {
              fetchNextPage();
            }}
          >
            <SkeletonItem fetchNextPage={fetchNextPage} acionFilter={actionFilter} />
          </InView>
        )}
      </DefaultErrorBoundary>
    </main>
  );
};
