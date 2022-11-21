import BalanceData from './BalanceData';
import Token from './Token';

export default interface TokenBalance {
  /**
   * Token information
   */
  token: Token;

  /**
   * amount of token that user own
   */
  amount: string;

  /**
   * token price in USD
   */
  price?: string;

  /**
   * amount in USD
   */
  amountUsdValue?: string;

  balanceInAssetDecimals: BalanceData['balance'];
}
