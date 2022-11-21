import React, { FC, useMemo } from 'react';
import { formatAmount } from '@components/TokenValueDisplay/format-amount';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import { useTokenByKey } from '@hooks/useTokenByKey';

interface PrimaryTextProps {
  status: string;
  amount: string;
  assetKey: string;
  spec: string;
  nftMetadata: NftAssetMetadata | null | undefined;
}

export const PrimaryText: FC<PrimaryTextProps> = ({ status, amount, assetKey, spec, nftMetadata }) => {
  const token = useTokenByKey(assetKey);

  const text = useMemo(() => {
    switch (spec) {
      case TokenStandard.ERC721:
        return `${status} 1 ${nftMetadata?.data?.name}`;

      case TokenStandard.ERC1155:
        return `${status} ${amount} ${nftMetadata?.data?.name}`;

      default:
        return token ? `${status} ${formatAmount({ token, amount, precision: 'display' })}` : '';
    }
  }, [amount, nftMetadata?.data?.name, spec, status, token]);

  return <>{text}</>;
};
