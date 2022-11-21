import { WalletConfig } from 'src/types/props/WalletProps';
export interface IBridgeEvent {
  allowedOrigin: string[];
}
export type DefaultParams = unknown[] | object;
export interface BridgeEventData<T = DefaultParams> {
  id: number;
  method: string;
  params: T;
}

export interface OpenScreenParams {
  deeplink: string;
}

export interface SetChainIdParams {
  chainId: string;
}

export interface BridgeEventResponse<T = any> {
  id: number;
  method: string;
  response: T;
}

export interface JSONRPCErrorResponse {
  id: number;
  error: JSONRPCError;
}

export interface JSONRPCError {
  code: JSONRPCErrorCode;
  message: string;
  data?: T;
}

export type OpenWalletCall = (config: WalletConfig) => void;

export type BridgeEventHandler<T = DefaultParams> = (payload: BridgeEventData<T>) => Promise<void>;

export type MethodMap = Record<string, BridgeEventHandler<any>>;
