import React from 'react';

import GameTransactionsSignContainer from '@pages/GameTransactionsSign/GameTransactionsSignContainer';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

const GameTransactionsSignPage = () => (
  <DefaultErrorBoundary>
    <GameTransactionsSignContainer />
  </DefaultErrorBoundary>
);

export default GameTransactionsSignPage;
