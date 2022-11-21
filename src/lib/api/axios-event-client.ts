import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import EventEmitter from 'events';

export interface CustomApiClientOptions {
  enableErrorHandling?: boolean;
  transformErrorResponse?: (data: unknown) => string | null;
}

declare module 'axios' {
  interface AxiosRequestConfig extends CustomApiClientOptions {}
}

interface ApiEvent {
  'api:error': (message: string) => void;
  'api:unauthorized': () => void;
}

export declare interface AxiosEventClient {
  on: <U extends keyof ApiEvent>(event: U, listener: ApiEvent[U]) => this;
  off: <U extends keyof ApiEvent>(event: U, listener: ApiEvent[U]) => this;
  emit: <U extends keyof ApiEvent>(event: U, ...args: Parameters<ApiEvent[U]>) => boolean;
}

export const apiClientInstances: AxiosEventClient[] = [];

export class AxiosEventClient extends EventEmitter {
  private readonly _name: string;
  private readonly _client: AxiosInstance;
  private readonly _transformError: ((error: AxiosError) => string | null) | undefined;

  private readonly expected401Paths = new Set<string>(['/api/login/status', '/api/mfa/status']);

  constructor(name: string, config: AxiosRequestConfig, transformError?: (error: AxiosError) => string | null) {
    super();

    this._name = name;
    this._transformError = transformError;

    this._client = axios.create(config);
    this._client.interceptors.response.use((response) => response, this.onRejected.bind(this));

    apiClientInstances.push(this);
  }

  getClient(): AxiosInstance {
    return this._client;
  }

  private onRejected(error: AxiosError) {
    console.error({
      service: this._name,
      status: error.response?.status,
      data: error.response?.data,
    });

    try {
      const requestUrl = new URL(error.request.responseURL);
      if (error.response?.status === 401 && !this.expected401Paths.has(requestUrl.pathname)) {
        this.emit('api:unauthorized');
      }

      if (error.config.enableErrorHandling) {
        const message =
          error.config.transformErrorResponse?.(error.response?.data) ?? this._transformError?.(error) ?? error.message;

        this.emit('api:error', message);
      }
    } catch (e: unknown) {
      console.error(e);
    }

    throw error;
  }
}
