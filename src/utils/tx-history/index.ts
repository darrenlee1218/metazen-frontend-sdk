/* eslint-disable complexity */
interface TxHistoryEvent {
  ticker: string;
  createdAt: string;
  from: string;
  to: string;
}

function roundDigit(num: number | string, digit: number): string {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }

  if (num < 1 / 10 ** digit) {
    return `<${(1 / 10 ** digit).toString()}`;
  }

  return (Math.round((num + Number.EPSILON) * 10 ** digit) / 10 ** digit).toString();
}

export const getDepositWithdrawalInfo = (myWalletAddresses: string[]) => (from: string, to: string) => {
  const isMyWithdrawal = myWalletAddresses.includes(from);
  const isMyDeposit = myWalletAddresses.includes(to);
  return {
    isMyWithdrawal,
    isMyDeposit,
  };
};

// eslint-disable-next-line consistent-return
export const getTxUrl = (txUrl: string, hash: string): string => {
  return txUrl.concat(hash);
};

function checkHexValue(tokenTransfered: string) {
  if (tokenTransfered && tokenTransfered !== '') {
    return tokenTransfered;
  }
  return '0x0';
}

export type { TxHistoryEvent };
export { checkHexValue, roundDigit };
