import { configureStore, combineReducers, AnyAction, Reducer } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  PersistConfig,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { bookKeepingReducer, bookKeepingReducerPath, bookKeepingMiddleware } from './api/bookKeeping';
import { assetMasterReducer, assetMasterReducerPath, assetMasterMiddleware } from './api/assetMaster';
import {
  assetMetadataCacheServiceReducer,
  assetMetadataCacheServiceReducerPath,
  assetMetadataCacheServiceMiddleware,
} from './api/assetMetadataCache';
import { assetEvaluatorMiddleware, assetEvaluatorReducer, assetEvaluatorReducerPath } from './api/assetEvaluator';

import { walletConfigSlice } from './reducer/walletConfig';
import { networkStatusSlice } from './reducer/networkStatus';
import { nftDetailsStatusSlice } from './reducer/nftDetailsStatus';
import { kycMiddleware, kycReducer, kycReducerPath } from './api/kyc';
import { pendingTransactionsSlice } from './reducer/pendingTransactions';
import type { RootState } from './types';
import { appSlice } from './reducer/app';
import { mfaSlice } from './reducer/mfa';

const PERSIST_KEY = 'gryfyn';

export const appReducer = combineReducers({
  [kycReducerPath]: kycReducer,
  [assetMasterReducerPath]: assetMasterReducer,
  [bookKeepingReducerPath]: bookKeepingReducer,
  [assetEvaluatorReducerPath]: assetEvaluatorReducer,
  [appSlice.name]: appSlice.reducer,
  [mfaSlice.name]: mfaSlice.reducer,
  [walletConfigSlice.name]: walletConfigSlice.reducer,
  [networkStatusSlice.name]: networkStatusSlice.reducer,
  [nftDetailsStatusSlice.name]: nftDetailsStatusSlice.reducer,
  [pendingTransactionsSlice.name]: pendingTransactionsSlice.reducer,
  [assetMetadataCacheServiceReducerPath]: assetMetadataCacheServiceReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'app/clearAll') {
    // cleanup persisted data
    storage.removeItem(`persist:${PERSIST_KEY}`);

    // reset redux
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistConfig: PersistConfig<ReturnType<typeof appReducer>> = {
  key: PERSIST_KEY,
  version: 1,
  storage,
  whitelist: [pendingTransactionsSlice.name, walletConfigSlice.name],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(assetMasterMiddleware)
      .concat(bookKeepingMiddleware)
      .concat(assetEvaluatorMiddleware)
      .concat(kycMiddleware)
      .concat(assetMetadataCacheServiceMiddleware),
});

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
