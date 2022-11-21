import { BridgeEventData, BridgeEventResponse } from './types';

export const messageHeader = '{gryfyn_message}';

// this is used to separate events that not ours,
// since event listener now is bind to `window`
const eventNotHandle: BridgeEventData = {
  id: -1,
  method: 'none',
  params: [],
};

export const createCheckOrigin = (allowedOrigins: string[]) => (origin: string) => {
  for (const allowed of allowedOrigins) {
    if (allowed === '*' || origin === allowed) return;
  }
  throw new Error(`origin not in the white list, receiving ${origin}`);
};

export const checkTrusted = (event: MessageEvent) => {
  if (!event.isTrusted) {
    throw new Error(`Receiving untrusted event`);
  }
};

/**
 * parse event data into certain format.
 * Since the listener is listening to global events, any errors happen here
 * will make the event left unhandled.
 * @param event
 * @returns
 */
export const messageEventDataParser = (event: MessageEvent): BridgeEventData => {
  const resultEvent = eventNotHandle;
  try {
    // why we need to using string and parse JSON?
    if (!event?.data?.toString().startsWith(messageHeader)) {
      return resultEvent;
    }
    const data = event.data.replace(messageHeader, '');
    const { id, method, params } = JSON.parse(data);
    return {
      id: id ?? resultEvent.id,
      method: method ?? resultEvent.method,
      params: params ?? resultEvent.params,
    };
  } catch (err) {
    console.log(err);
    return resultEvent;
  }
};

export const messageEventResponseParser = (event: MessageEvent): BridgeEventResponse | undefined => {
  try {
    // why we need to using string and parse JSON?
    if (!event?.data?.toString().startsWith(messageHeader)) {
      return;
    }
    const data = event.data.replace(messageHeader, '');
    const { id, method, response } = JSON.parse(data);
    return {
      id,
      method,
      response,
    };
  } catch (err) {
    console.log(err);
  }
};
