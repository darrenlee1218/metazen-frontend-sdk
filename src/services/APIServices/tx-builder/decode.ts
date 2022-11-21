/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-redeclare */
import { utils } from 'ethers';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { BuiltTx } from './types';

enum TRANSFER_FUNCTIONS {
  transfer = 'function transfer(address from, uint256 value)',
  transferFrom = 'function transferFrom(address from, address to, uint256 value)',
  safeTransferFrom_ERC721 = 'function safeTransferFrom(address from, address to, uint256 tokenId)',
  safeTransferFrom_ERC1155 = 'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
}

export const getValueSentFromData = (tx: BuiltTx, standard: TokenStandard) => {
  switch (standard) {
    case TokenStandard.NATIVE:
      return tx.value;

    case TokenStandard.ERC20:
      const transferInterface = new utils.Interface([TRANSFER_FUNCTIONS.transfer]);
      const decodedErc20Value = transferInterface.decodeFunctionData('transfer', tx.data);
      return decodedErc20Value[1].toHexString();

    case TokenStandard.ERC1155:
      const safeTransferFrom1155Interface = new utils.Interface([TRANSFER_FUNCTIONS.safeTransferFrom_ERC1155]);
      const decodedErc1155Value = safeTransferFrom1155Interface.decodeFunctionData('safeTransferFrom', tx.data);
      return decodedErc1155Value[3].toHexString();

    default:
      throw Error('ERC standard not supported for decoding sent value from transaction');
  }
};
