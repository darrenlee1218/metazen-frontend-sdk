import { getTxUrl } from '../tx-history/index';

describe('Return some Value', () => {
  it('should have two string combined', () => {
    expect(getTxUrl('abcd', 'efg')).toBe('abcdefg');
  });
});
