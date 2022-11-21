import React from 'react';

import GameTransactionsApproveContainer from '@pages/GameTransactionsApprove/GameTransactionsApproveContainer';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

const GameTransactionsApprovePage = () => {
  return (
    <DefaultErrorBoundary>
      <GameTransactionsApproveContainer />
    </DefaultErrorBoundary>
  );
};

export default GameTransactionsApprovePage;
