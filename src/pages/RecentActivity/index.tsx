import React, { useEffect, useMemo, useState } from 'react';
import { InView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CustomTheme, useTheme } from '@mui/material';

import { Dropdown } from '@components/Dropdown';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import { PendingTxOperationModal } from '@components/PendingTxOperationModal';

import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';
import { PendingTransactionRecord, TPendingTxOperation } from '@gryfyn-types/props/PendingTransactionProps';

import { useSnackbar } from '@lib/snackbar';
import { selectPendingTransactions } from '@redux/selector';
import { useTransactionHistory } from '@hooks/useTransactionHistory';
import { deletePendingTx } from '@redux/reducer/pendingTransactions';
import { SingleListItem } from '@pages/RecentActivity/SingleListItem';
import { ACTION_LIST, TYPE_LIST } from '@constants/recentActivityFilter';

import { SkeletonItem } from './SkeletonItem';
import { ProcessingItem } from './ProcessingItem';

const ContainerBox = styled(Box)({
  marginTop: '24px',
  marginBottom: '12px',
  marginLeft: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const FilterBox = styled(Box)({
  '& > div': {
    marginRight: '4px',
  },
});

const LoadingText = styled(Typography)({
  marginTop: '14px',
  marginHorizontal: 'auto',
  color: 'text.primary',
});

const ResetButton = styled(Button)({
  '&.MuiButtonBase-root:hover': {
    bgcolor: 'transparent',
  },
  textTransform: 'none',
  paddingTop: '0px',
  paddingBottom: '0px',
});

const ItemList = styled(List)({
  backgroundColor: 'background.paper',
  marginLeft: '24px',
  marginRight: '24px',
  paddingLeft: 0,
  paddingRight: 0,
});

export const RecentActivityPage: React.FC = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [typeFilter, setTypeFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  // TODO: please uncomment and use it for opening Speed Up and Cancel Dialog Screen
  const [openDialog, setOpenDialog] = useState(false);
  const [portalOption, setPortalOption] = useState<TPendingTxOperation>(TPendingTxOperation.Speedup);
  const [modalHash, setModalHash] = useState<string>('');
  const theme = useTheme() as CustomTheme;

  // keep it here to ensure useGetTopNTransactionsQuery can use latest tokens
  // const totalTokens = useGetTokensQuery();
  const onResetSelected = () => {
    setActionFilter('');
    setTypeFilter('');
  };

  // const pendingTxs = fakePendingTx;
  const pendingTxs = useSelector(selectPendingTransactions);

  const filterModal = (array: PendingTransactionRecord[]): PendingTransactionRecord => {
    return array.filter((item: PendingTransactionRecord) => item.hash === modalHash)[0];
  };

  const { fetchNextPage, hasNextPage, isLoading, recentHistoryData, isError } = useTransactionHistory(10, '');

  const recentActivityListByFilter = useMemo(() => {
    const filterMethods = [
      (item: RecentActivityItemProps) => item.depositOrWithdrawal.endsWith(actionFilter),
      (item: RecentActivityItemProps) => {
        switch (true) {
          case typeFilter === 'nft':
            return item.spec === 'ERC-721' || item.spec === 'ERC-1155';
          case typeFilter === 'token':
            return item.spec !== 'ERC-721' && item.spec !== 'ERC-1155';
          default:
            return item;
        }
      },
    ];
    return recentHistoryData?.pages?.filter((item) => {
      for (let i = 0; i < filterMethods.length; i++) {
        if (!filterMethods[i](item)) {
          return false;
        }
      }
      return true;
    });
  }, [recentHistoryData, actionFilter, typeFilter]);

  useMemo(() => {
    if (pendingTxs.length > 0 && recentHistoryData && recentHistoryData?.pages.length > 0) {
      const allHash = recentHistoryData?.pages.map((a) => a.hash);
      allHash.forEach((hash: string) => {
        if (pendingTxs.map((a) => a.hash).includes(hash)) {
          dispatch(deletePendingTx(hash));
        }
      });
    }
  }, [recentHistoryData, pendingTxs, dispatch]);

  const removeDuplicatePendingTx = () => {
    const concatBothCancelAndSpeedupFrom = pendingTxs
      .map((a) => a.speedUpFrom)
      .concat(pendingTxs.map((a) => a.cancelledFrom));
    const filterMethods = [(item: PendingTransactionRecord) => !concatBothCancelAndSpeedupFrom.includes(item.hash)];
    return pendingTxs?.filter((item) => {
      for (let i = 0; i < filterMethods.length; i++) {
        if (!filterMethods[i](item)) {
          return false;
        }
      }
      return true;
    });
  };

  const menuProps = {
    anchorOrigin: {
      vertical: 'top' as number | 'bottom' | 'top' | 'center',
      horizontal: 'left' as number | 'right' | 'left' | 'center',
    },
    transformOrigin: {
      vertical: 'top' as number | 'bottom' | 'top' | 'center',
      horizontal: 'left' as number | 'right' | 'left' | 'center',
    },
    getContentAnchorEl: null,
  };
  useEffect(() => {
    isError && enqueueSnackbar('Can’t fetch tx-history', { variant: 'error' });
  }, [isError]);

  return (
    <main>
      <DefaultErrorBoundary>
        <Box sx={{ p: 0, bgcolor: 'background.paper' }}>
          <Typography variant="h1" align="center" color="text.primary" sx={{ mt: '24px', fontWeight: '600' }}>
            Recent Activity
          </Typography>
          {/* TODO: You can remove the following comment after integration of recent history list and the screen */}
          {modalHash && filterModal(pendingTxs) && (
            <PendingTxOperationModal
              hash={filterModal(pendingTxs).hash}
              tx={filterModal(pendingTxs).tx}
              nftId={filterModal(pendingTxs).nftId ?? ''}
              open={openDialog}
              setOpen={setOpenDialog}
              type={portalOption}
              token={filterModal(pendingTxs).token}
              gasPayer={filterModal(pendingTxs).gasPayer}
            />
          )}
          <ContainerBox>
            <FilterBox>
              <Dropdown list={ACTION_LIST} onChange={setActionFilter} value={actionFilter} menuProps={menuProps} />
              <Dropdown list={TYPE_LIST} onChange={setTypeFilter} value={typeFilter} menuProps={menuProps} />

              {(typeFilter || actionFilter) && (
                <ResetButton
                  disableRipple
                  variant="text"
                  onClick={onResetSelected}
                  sx={{ color: `${theme.palette.primary.main} !important` }}
                >
                  Reset
                </ResetButton>
              )}
            </FilterBox>
          </ContainerBox>

          {isLoading ? null : (
            <>
              {actionFilter === '' &&
                typeFilter === '' &&
                removeDuplicatePendingTx()?.map((item) => {
                  return (
                    <ProcessingItem
                      id={item.hash}
                      key={item.hash}
                      data={item.token}
                      tx={item.tx}
                      txUrl={item?.txUrl}
                      nftId={item?.nftId ?? ''}
                      changeOpenState={setOpenDialog}
                      changePortalType={setPortalOption}
                      changeModalChainId={setModalHash}
                    />
                  );
                })}
              {recentActivityListByFilter && recentActivityListByFilter.length > 0 ? (
                recentActivityListByFilter?.map((items: RecentActivityItemProps) => {
                  return (
                    <ItemList key={items.id}>
                      <SingleListItem data={items} />
                    </ItemList>
                  );
                })
              ) : (
                <LoadingText variant="h5" align="center" sx={{ marginTop: '14px' }}>
                  Latest transactions will appear here.
                </LoadingText>
              )}
              {hasNextPage && (
                <InView
                  as="div"
                  onChange={(inView) => {
                    fetchNextPage();
                  }}
                >
                  <SkeletonItem fetchNextPage={fetchNextPage} acionFilter={actionFilter} typeFilter={typeFilter} />
                </InView>
              )}
            </>
          )}
        </Box>
      </DefaultErrorBoundary>
    </main>
  );
};
