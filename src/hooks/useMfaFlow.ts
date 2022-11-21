import { useCallback, useEffect, useState } from 'react';
import { JSONRPCErrorException } from 'json-rpc-2.0';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@redux/types';
import { openMfaModal, resetMfaState, closeMfaModal } from '@redux/reducer/mfa';

import { signTx as signTxApi } from '@services/APIServices/wallet';
import { BuiltTx, LegacyBuiltTx } from '@services/APIServices/tx-builder/types';

import { createJRPCClient } from '@lib/JRPCClient';

import { usePrevious } from './usePrevious';

const REACT_APP_METAZENS_MFA_API = process.env.REACT_APP_METAZENS_MFA_API ?? '';
const REACT_APP_METAZENS_WALLET_API = process.env.REACT_APP_METAZENS_WALLET_API ?? '';

export interface SignTxRequestBody {
  address: string;
  rawTx: BuiltTx | LegacyBuiltTx;
}
export type RegisterMFASuccessCallback = () => void;
export type SignTxSuccessCallback = (signedTx: string, requestBody: SignTxRequestBody) => Promise<void>;

interface SuccessCallback {
  signTx?: SignTxSuccessCallback;
  registerMFA?: RegisterMFASuccessCallback;
}

/**
 * Call /api/mfa/status to check whether user have valid 2FA session
 *
 * @returns boolean whether user have valid 2FA session
 */
const getMFAStatus = async () => {
  // get 2FA verified status, 200 = OK/401 = not OK
  const response = await fetch(REACT_APP_METAZENS_MFA_API + '/status');

  if (response.status === 200) {
    return true;
  }
  return false;
};

export const useMfaFlow = ({
  signTx: signTxSuccessCallback,
  registerMFA: registerMFASuccessCallback,
}: SuccessCallback) => {
  const dispatch = useDispatch();
  const [signTxLoading, setSignTxLoading] = useState(false);
  const [signTxError, setSignTxError] = useState<string>();
  const [failedSignTxRequestBody, setFailedSignTxRequestBody] = useState<SignTxRequestBody>();

  const { verified } = useSelector((state: RootState) => state.mfa);
  const previousVerified = usePrevious(verified);

  const signTx = useCallback(
    async (address: string, rawTx: BuiltTx | LegacyBuiltTx, withMfa?: boolean) => {
      try {
        // cleanup error before start
        setSignTxError('');
        setSignTxLoading(true);
        const client = createJRPCClient(
          withMfa ? REACT_APP_METAZENS_MFA_API : REACT_APP_METAZENS_WALLET_API,
          withMfa ? 'mfa' : 'wallet',
        );
        const signedTx = await signTxApi(address, rawTx, client);

        // reset all mfa state in redux (verified, openModal to false)
        dispatch(resetMfaState());
        await signTxSuccessCallback?.(signedTx, { address, rawTx });
        setSignTxLoading(false);
      } catch (e) {
        // finish loading
        setSignTxLoading(false);
        if (
          // make sure `e` is JRPC error, then we can verify JRPC error code
          e instanceof JSONRPCErrorException &&
          // check whether code means "2FA required"
          e.code.toString() === '-32100' &&
          // if getting error (include "2FA required") with /api/mfa, not retry anymore and throw error
          !withMfa
        ) {
          // check whether user have valid 2FA session
          const isMFAReady = await getMFAStatus();
          if (isMFAReady) {
            // MFA session available, retry request with /api/mfa
            signTx(address, rawTx, true);
          } else {
            // store failed tx body for retry
            setFailedSignTxRequestBody({ address, rawTx });
            // open Keycloak 2FA input
            dispatch(openMfaModal());
          }
        } else {
          // both Error and JSONRPCErrorException have `message` property
          // so just use e.message even it's a JSONRPCErrorException from /api/mfa (withMfa = true)
          setSignTxError((e as Error).message);
        }
      }
    },
    [signTxSuccessCallback],
  );

  const registerMFA = useCallback(() => {
    dispatch(openMfaModal());
  }, []);

  useEffect(() => {
    if (!previousVerified && verified) {
      // mfa changed from NOT VERIFIED to VERIFIED
      // close modal
      dispatch(closeMfaModal());
      if (failedSignTxRequestBody) {
        // retry request
        signTx(failedSignTxRequestBody.address, failedSignTxRequestBody.rawTx, true);
      } else if (registerMFASuccessCallback) {
        // no pending request, directly trigger callback
        registerMFASuccessCallback();
      }
    }
  }, [signTx, verified, previousVerified, failedSignTxRequestBody, registerMFASuccessCallback]);

  return {
    signTx,
    signTxError,
    signTxLoading,
    registerMFA,
  };
};
