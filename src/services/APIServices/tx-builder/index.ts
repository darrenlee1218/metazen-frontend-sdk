import { createJRPCClient } from '@lib/JRPCClient';

const REACT_APP_METAZENS_TXBUILDER_API = process.env.REACT_APP_METAZENS_TXBUILDER_API ?? '';

export const txbuilderClient = createJRPCClient(REACT_APP_METAZENS_TXBUILDER_API, 'tx-builder');

export * from './fee';
export * from './regex';
export * from './types';
export * from './utils';
export * from './v1Api';
export * from './v2Api';
