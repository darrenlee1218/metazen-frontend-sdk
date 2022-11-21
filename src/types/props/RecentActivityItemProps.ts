interface RecentActivityItemProps {
  id: string;
  iconUrl: string;
  assetName: string;
  amount: string;
  from: string;
  to: string;
  when: string;
  depositOrWithdrawal: string;
  txUrl: string;
  spec: string;
  primaryStatus: string;
  status: string;
  hash: string;
  assetKey: string;
  chainId?: string;
  contractAddress?: string;
  tokenID?: string;
}

export default RecentActivityItemProps;
