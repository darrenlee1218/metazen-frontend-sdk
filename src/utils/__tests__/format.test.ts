import { format } from 'date-fns';

import { formatAddress, formatTxHistoryTime } from '../format';

describe('[utils][format]', () => {
  it('[formatAddress] Success format address with more than 11 chars', () => {
    const result = formatAddress('0xcff4e1d6b4af8b5cb3f56407bd74298d1b3847b9');
    const expected = '0xcf...47b9';
    expect(result).toEqual(expected);
  });

  it('[formatAddress] Success - format address with less than 11 chars', () => {
    const result = formatAddress('0xcff4e1d6b');
    const expected = '0xcff4e1d6b';
    expect(result).toEqual(expected);
  });

  it('[formatTxHistoryTime] Success - format old time to tx-history time', () => {
    const result = formatTxHistoryTime('2022-06-30T07:10:35.845Z');
    expect(result).toEqual('Jun 30');
  });

  it('[formatTxHistoryTime] Success - format current time to tx-history time', () => {
    const result = formatTxHistoryTime(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
    expect(result.includes(':')).toBeTruthy();
  });
});
