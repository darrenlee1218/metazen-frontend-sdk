export interface NetworkStatusProps {
  appNetworkStatus: 'error' | 'success';
  sourceComponent: string;
  forceRefresh: boolean;
}
