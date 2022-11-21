import { getValueSentFromData } from '../decode';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

it('decode ERC-20 transfer value', () => {
  const tx = {
    from: '',
    to: '',
    type: 2,
    nonce: 0,
    value: '0x0',
    chainId: '0x3',
    gasLimit: '0x0',
    maxFeePerGas: '0x0',
    maxPriorityFeePerGas: '0x0',
    data: '0xa9059cbb000000000000000000000000f749f59738015c0b6d6d184ff814111893c7257d00000000000000000000000000000000000000000000000000038d7ea4c68000',
  };

  const value = '0x038d7ea4c68000';

  expect(getValueSentFromData(tx, TokenStandard.ERC20)).toBe(value);
});
