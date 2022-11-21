import BigNumber from 'bignumber.js';
import { utils } from 'ethers';

import SendToken from '@gryfyn-types/data-transfer-objects/SendToken';
import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';
import { checkEnoughAvailableBalance, checkNonZeroInput, VALID_INPUT_AMOUNT } from '@services/APIServices/tx-builder';

export const checkDecimalPlacesValidity = (inputAmount: string, token?: SendToken): boolean => {
  if (VALID_INPUT_AMOUNT.test(inputAmount) && typeof token !== 'undefined') {
    // Carry out decimal places checking to ensure it's not exceeding the token atomic unit
    const inputAmountDecimals = new BigNumber(inputAmount).dp();
    if (inputAmountDecimals > token.decimals) {
      return false;
    }
    return true;
  }
  return true;
};

export const addressValidationRules = (token?: SendToken) => ({
  type: 'text',
  required: true,
  minlength: 42,
  maxlength: 42,
  pattern: {
    value: /^0x[0-9a-fA-F]{40}$/,
    message: `Please enter a valid ${token?.tokenAssetTicker} address.`,
  },
  validate: {
    checksum: (v: string) => {
      if (v.length === 0 || utils.isAddress(v)) return true;
      return `Please enter a valid ${token?.tokenAssetTicker} address.`;
    },
  },
});

export const amountValidationRules = (token?: SendToken) => ({
  type: 'text',
  required: true,
  pattern: {
    value: VALID_INPUT_AMOUNT,
    message: fieldErrorMessages.amountValidation,
  },
  validate: (value: any) => {
    const inputAmount = String(value);
    const validDecimalPlaces = checkDecimalPlacesValidity(inputAmount, token);
    if (validDecimalPlaces) {
      const isGreaterThanZero = checkNonZeroInput(inputAmount);
      const enoughBalance = checkEnoughAvailableBalance(inputAmount, token);
      return isGreaterThanZero
        ? enoughBalance || fieldErrorMessages.amountExceedBalance
        : fieldErrorMessages.amountValidation;
    }
    return fieldErrorMessages.amountValidation;
  },
});
