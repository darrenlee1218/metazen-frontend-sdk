import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { JSONRPCParams, JSONRPCClient } from 'json-rpc-2.0';

import Token from '@gryfyn-types/data-transfer-objects/Token';

import { createJRPCClient } from '../JRPCClient';
import type { RootState } from '@redux/types';

export interface JSONRPCRequestBaseQueryArg {
  client: JSONRPCClient<any>;
  useTokenMeta?: boolean;
}

export interface JSONRPCRequestBaseQueryMeta {
  tokens?: Token[];
}

export const jsonRPCRequestBaseQuery = (
  options: JSONRPCRequestBaseQueryArg,
): BaseQueryFn<{ method: string; params?: JSONRPCParams }, unknown, unknown, unknown, JSONRPCRequestBaseQueryMeta> => {
  return async (
    { method, params },
    // TODO: handle AbortSignal
    { signal, getState },
  ) => {
    const meta: JSONRPCRequestBaseQueryMeta = {};
    const data = await options.client.request(method, params);

    if (options.useTokenMeta) {
      const cachedData = (getState() as RootState)?.assetMaster?.queries?.['getTokens(undefined)']?.data as
        | Token[]
        | undefined;
      meta.tokens = cachedData ?? [];
    }

    return {
      data,
      meta,
    };
  };
};
