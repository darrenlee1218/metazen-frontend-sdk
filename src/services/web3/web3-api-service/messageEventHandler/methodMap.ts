import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';

import { checkIsLoggedIn } from '@contexts/auth';
import { WalletConfig } from 'src/types/props/WalletProps';
import { ecRecovery, getAddresses } from '@services/APIServices/wallet';
import { getBalances } from '@services/APIServices/book-keeping';

import { getUserAccountLevel } from '@services/APIServices/user-service';

import { bridgeDataEmitter, bridgeEmitError, ActiveEmit } from './bridgeDataEmitter';
import {
  BridgeEventData,
  BridgeEventHandler,
  MethodMap,
  OpenScreenParams,
  OpenWalletCall,
  SetChainIdParams,
} from './types';
import { networkVersion } from '../walletNetworkVersion';
import { connectedHostInfo } from '../connectedHostInfo';

// this store the global state of the login stuff.
// TODO: need to put it to a better place
let isLogin = false;
let chainId = '0';

const emitNoLoginError = (id: number) => bridgeEmitError(4100, id, 'Not Login');

export const handleLoginCheck: BridgeEventHandler = async ({ method, id }) => {
  isLogin = await privateCheckLogin(id);
  bridgeDataEmitter({
    method,
    id,
    response: {
      isLogin,
    },
  });
};

export const handleLogin = async () => {
  isLogin = true;
  chainId = networkVersion.getChainId();
  const addresses = await getAddresses(chainId);
  bridgeDataEmitter({
    method: ActiveEmit.CONNECTED,
    id: -1,
    response: { chainId, addresses: addresses.map((a) => a.address) },
  });
};

export const handleGetUserLevel: BridgeEventHandler = async ({ method, id }) => {
  const userLevelString = await getUserAccountLevel();
  const userLevel = parseInt(userLevelString, 10);
  bridgeDataEmitter({
    method,
    id,
    response: userLevel,
  });
};

export const handleProviderHost: BridgeEventHandler<{ hostname: string }> = async ({ method, id, params }) => {
  const { hostname } = params;
  connectedHostInfo.setHostDomin(hostname);
  bridgeDataEmitter({
    method,
    id,
    response: hostname,
  });
};

export const handleLogout = async () => {
  isLogin = false;
  bridgeDataEmitter({
    method: ActiveEmit.DISCONNECTED,
    id: -1,
    response: {},
  });
  handleCloseWallet();
};

export const handleCloseWallet = async () => {
  bridgeDataEmitter({
    method: ActiveEmit.CLOSE_WALLET,
    id: -1,
    response: {},
  });
};

const privateCheckLogin = async (id: number) => {
  // login state should not be stored in FE local variables.
  // a regular check is needed to avoid async states between session records and FE behaviours
  try {
    isLogin = await checkIsLoggedIn();
    // keep these around for a while
    chainId = networkVersion.getChainId();
    // !isLogin && bridgeEmitError(4100, id, 'Not Login');
    return isLogin;
  } catch (err) {
    // bridgeEmitError(4100, id, 'Not Login');
    return false;
  }
};

const handleAccount: BridgeEventHandler = async ({ method, id }) => {
  isLogin = await privateCheckLogin(id);
  if (isLogin) {
    const addressResponse = await getAddresses(chainId);
    bridgeDataEmitter({
      method,
      id,
      response: addressResponse,
    });
  } else {
    emitNoLoginError(id);
  }
};

const handleBalance: BridgeEventHandler = async ({ method, id }) => {
  isLogin = await privateCheckLogin(id);
  if (isLogin) {
    const balance = await getBalances();
    bridgeDataEmitter({
      method,
      id,
      response: balance,
    });
  } else {
    emitNoLoginError(id);
    // bridgeEmitError(4100, id, 'Not Login');
  }
};

const handleGetChainId: BridgeEventHandler = async ({ method, id }) => {
  // console.log('-- handleGetChainId', method, id);
  isLogin = await privateCheckLogin(id);
  if (isLogin) {
    const mychainId = networkVersion.getChainId();
    chainId = mychainId;
    bridgeDataEmitter({
      method,
      id,
      response: { chainId: mychainId },
    });
  } else {
    emitNoLoginError(id);
    // bridgeEmitError(4100, id, 'Not Login');
  }
};

const handleSetChainId: BridgeEventHandler<SetChainIdParams> = async ({ method, id, params }) => {
  // REMARK: optimise later, repeated flow for signing actions
  // console.log('FE, gryfyn_change_chain_id', params);
  isLogin = await privateCheckLogin(id);
  if (isLogin) {
    const p = params;
    const myChainId = p ? p.chainId : null;
    if (myChainId) {
      networkVersion.setNetwork(myChainId);
      chainId = myChainId;
    }
    bridgeDataEmitter({ method, id, response: 'gryfyn_set_chain_id_success' });
  } else {
    emitNoLoginError(id);
  }
};
const handleEcRecovery: BridgeEventHandler = async ({ method, id, params }) => {
  // console.log('FE, gryfyn_ecrecovery', params);
  isLogin = await privateCheckLogin(id);
  if (isLogin) {
    const [chainID, address, hexMessage, hexSign] = <string[]>params;
    const response = await ecRecovery(chainID, address, hexMessage, hexSign);
    bridgeDataEmitter({ method, id, response });
  } else {
    emitNoLoginError(id);
    // bridgeEmitError(4100, id, 'Not Login');
  }
};

const createHandleOpenWallet =
  (
    openWalletCall: OpenWalletCall,
    navigate: NavigateFunction,
    setConfig: Dispatch<SetStateAction<WalletConfig>>,
  ): BridgeEventHandler<WalletConfig> =>
  async ({ method, id, params }) => {
    setConfig(params);
    openWalletCall(params);
    navigate('/');
    bridgeDataEmitter({ method, id, response: 'gryfyn_open_wallet_success' });
  };

const createHandleSendTransaction =
  (navigate: NavigateFunction): BridgeEventHandler =>
  async ({ method, id, params }) => {
    // REMARK: optimise later, repeated flow for signing actions
    // console.log('FE, gryfyn_send_transaction', params);
    if (await privateCheckLogin(id)) {
      if (params instanceof Array) {
        // problem here. why `params` has to be array,
        // we should only handle 1 send request a time only.
        // futher requests should be rejected or put to some queue?
        navigate('/page/in-game-transactions', {
          state: {
            data: {
              method,
              params,
              id,
            },
          },
        });
      }
    } else {
      emitNoLoginError(id);
    }
  };

const createHandleSignMessage =
  (navigate: NavigateFunction): BridgeEventHandler =>
  async ({ method, id, params }) => {
    // REMARK: optimise later, repeated flow for signing actions
    // console.log('FE, gryfyn_sign_message', params);
    isLogin = await privateCheckLogin(id);
    if (isLogin) {
      if (params instanceof Array) {
        navigate('/page/in-game-sign-message', {
          state: {
            data: {
              method,
              params,
              id,
            },
          },
        });
      } else {
        emitNoLoginError(id);
        // should use other error code?
        // bridgeEmitError(4100, id, 'unauthorized');
      }
    }
  };

const createHandleSignTypedData =
  (navigate: NavigateFunction): BridgeEventHandler =>
  async ({ method, id, params }) => {
    // REMARK: optimise later, repeated flow for signing actions
    // console.log('FE, gryfyn_sign_typed_data', params);
    isLogin = await privateCheckLogin(id);
    if (isLogin) {
      if (params instanceof Array) {
        navigate('/page/in-game-sign-typed-data', {
          state: {
            data: {
              method,
              params,
              id,
            },
          },
        });
      } else {
        emitNoLoginError(id);
        // should use other error code?
        // bridgeEmitError(4100, id, 'unauthorized');
      }
    }
  };

export const createHandleOpenScreen =
  (navigate: NavigateFunction): BridgeEventHandler<OpenScreenParams> =>
  async ({ method, id, params }) => {
    isLogin = await privateCheckLogin(id);
    if (isLogin) {
      const { deeplink } = params;
      navigate(deeplink ?? '/');
      bridgeDataEmitter({ method, id, response: 'gryfyn_open_screen_success' });
    } else {
      emitNoLoginError(id);
      // bridgeEmitError(4100, id, 'Not Login');
    }
  };

export const getMethodMap = (
  openWalletCall: OpenWalletCall,
  navigate: NavigateFunction,
  setConfig: Dispatch<SetStateAction<WalletConfig>>,
): MethodMap => ({
  gryfyn_is_login: handleLoginCheck,
  gryfyn_account: handleAccount,
  gryfyn_balance: handleBalance,
  gryfyn_chain_id: handleGetChainId,
  gryfyn_set_chain_id: handleSetChainId,
  gryfyn_ecrecovery: handleEcRecovery,
  gryfyn_get_user_level: handleGetUserLevel,
  gryfyn_set_hostname: handleProviderHost,
  gryfyn_open_wallet: createHandleOpenWallet(openWalletCall, navigate, setConfig),
  gryfyn_send_transaction: createHandleSendTransaction(navigate),
  gryfyn_sign_message: createHandleSignMessage(navigate),
  gryfyn_sign_typed_data: createHandleSignTypedData(navigate),
  gryfyn_open_screen: createHandleOpenScreen(navigate),
});

export async function execMethod(methodMap: MethodMap, payload: BridgeEventData): Promise<void> {
  const func: BridgeEventHandler | undefined = methodMap[payload.method];
  if (typeof func === 'function') {
    return await func(payload);
  }
  // unsupported method from methodMap will all return error
  const { id } = payload;
  bridgeEmitError(4200, id, 'method not supported');
}
