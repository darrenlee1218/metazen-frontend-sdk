import { JSONRPCClient } from 'json-rpc-2.0';

export interface SignTxPendingResponse {
  traceId: string;
  traceMethod: string;
}

export enum SignTxStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}
// export type SignTxStatus = 'PENDING'|'REJECTED'|'APPROVED'

export interface SignTxPendingResolvedResponse {
  status: SignTxStatus;
  rejectReason?: string;
  tx?: string;
}

export interface SignTxPendingRequest {
  traceId: string;
}

export const loopFetching = async (
  client: JSONRPCClient<any>,
  method: string,
  traceId: string,
  params: SignTxPendingResolvedResponse,
  timeMs: number = 3000,
): Promise<SignTxPendingResolvedResponse> => {
  if (params.status !== SignTxStatus.PENDING) return params;
  // wait certain time for next request.
  // this lint is annoying
  await (async () => new Promise((resolve, reject) => setTimeout(resolve, timeMs)))();
  const res = await client.request(method, { traceId });
  return loopFetching(client, method, traceId, res);
};
