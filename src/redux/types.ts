import { appReducer, store } from './store';

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof appReducer>;
