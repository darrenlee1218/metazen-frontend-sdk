import React, { FC, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';

import { TokenDisplayRow } from '@components/TokenDisplayRow';
import { OtherItemsCollapsible } from '@components/OtherItemsCollapsible';
import { TokenDisplayRowSkeleton } from '@components/TokenDisplayRow/TokenDisplayRowSkeleton';

import { useTokenBalances } from '@hooks/useTokenBalances';
import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';

import { toggleOtherTokens } from './atoms';

interface GameTokenListProps {
  onFetchError: () => void;
}

export const GameTokenList: FC<GameTokenListProps> = ({ onFetchError }) => {
  const navigate = useNavigate();
  const [isOpen, toggleIsOpen] = useAtom(toggleOtherTokens);

  const {
    isLoading,
    isLoadTokenError,
    isLoadBalanceError,
    isLoadPricesError,
    otherTokenBalances: otherTokenBalanceList,
    relevantTokenBalances: relevantTokenBalanceList,
  } = useTokenBalances();

  const generateClickHandler = useCallback(
    (tokenBalance: TokenBalance) => () => {
      navigate(`/token-details/${tokenBalance.token.key}`);
    },
    [navigate],
  );

  useEffect(() => {
    if (isLoadBalanceError || isLoadTokenError || isLoadPricesError) {
      onFetchError();
    }
  }, [isLoadBalanceError, isLoadPricesError, isLoadTokenError, onFetchError]);

  return (
    <Stack
      sx={{
        px: 3,
        mb: 4,
        width: '100%',
        bgcolor: 'background.paper',
      }}
      spacing={2}
    >
      <Stack spacing={1} sx={{ mt: 1.5 }}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <TokenDisplayRowSkeleton key={i} />)
          : relevantTokenBalanceList.map((item) => (
              <TokenDisplayRow key={item.token.key} onClick={generateClickHandler(item)} {...item} />
            ))}
      </Stack>

      {!isLoading && (
        <OtherItemsCollapsible
          isOpen={isOpen}
          onClick={toggleIsOpen}
          numItems={otherTokenBalanceList.length}
          label={`Other Tokens (${otherTokenBalanceList.length})`}
        >
          <Stack spacing={1} sx={{ mt: 1 }}>
            {otherTokenBalanceList.map((item) => (
              <TokenDisplayRow key={item.token.key} onClick={generateClickHandler(item)} {...item} />
            ))}
          </Stack>
        </OtherItemsCollapsible>
      )}
    </Stack>
  );
};
