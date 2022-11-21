import { createJRPCClient } from '@lib/JRPCClient';

const REACT_APP_METAZENS_ASSET_EVALUATOR_API = process.env.REACT_APP_METAZENS_ASSET_EVALUATOR_API ?? '';

export const assetevaluatorClient = createJRPCClient(REACT_APP_METAZENS_ASSET_EVALUATOR_API, 'asset-evaluator');

export const getPrices = (assetTickers: string[]) => () =>
  assetevaluatorClient.request('mtz_evaluatorGetPrices', assetTickers);
