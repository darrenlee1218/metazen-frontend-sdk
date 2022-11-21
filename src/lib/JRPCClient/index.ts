import { v4 as uuidv4 } from 'uuid';
import { JSONRPCClient, JSONRPCErrorResponse } from 'json-rpc-2.0';
import { AxiosEventClient, CustomApiClientOptions } from '@lib/api/axios-event-client';
import { AxiosError, AxiosRequestHeaders } from 'axios';

const FAKE_API_SERVER = process.env.REACT_APP_FAKE_API_SERVER === 'true' ?? false;

const getHeaders = (method: string): AxiosRequestHeaders => {
  if (FAKE_API_SERVER) {
    return {
      'Content-Type': 'application/json',
      'x-request-id': uuidv4(),
      Prefer: `example=${method}`,
    };
  }

  return {
    'Content-Type': 'application/json',
    'x-request-id': uuidv4(),
  };
};

export const createJRPCClient = (endpoint: string, name: string) => {
  let requestIdCounter = 0;
  const axiosClient = new AxiosEventClient(
    name,
    {
      baseURL: endpoint,
      withCredentials: true,
    },
    (error) => {
      if (!error.response?.data) return null;
      const typedData = error.response.data as JSONRPCErrorResponse;
      return typedData.error.message;
    },
  );

  const client = new JSONRPCClient<CustomApiClientOptions>(
    async (payload, clientParams) => {
      const headers = getHeaders(payload.method);

      try {
        const response = await axiosClient.getClient().post('', JSON.stringify(payload), {
          headers,
          ...clientParams,
        });
        client.receive(response.data);
      } catch (e: unknown) {
        if (e instanceof AxiosError && e.response) {
          client.receive(e.response.data);
        }

        throw e;
      }
    },
    () => String(++requestIdCounter),
  );

  return client;
};
