import { NftAttribute } from '@gryfyn-types/data-transfer-objects/NftCoreData';

export function filterByDisplayType(attributes: NftAttribute[]) {
  const nftAssetProperties: NftAttribute[] = [];
  const nftAssetBoosts: NftAttribute[] = [];
  for (const attribute of attributes) {
    const { display_type: displayType } = attribute;
    const nftAssetAttribute = {
      ...attribute,
      trait_type: attribute.trait_type.replace(/_/g, ' '),
    };

    if (!displayType) {
      nftAssetProperties.push(nftAssetAttribute);
    }
    if (displayType && displayType === 'boost_number') {
      nftAssetBoosts.push(nftAssetAttribute);
    }
  }
  return {
    nftAssetProperties,
    nftAssetBoosts,
  };
}

export function sortByTraitType(prop1: Pick<NftAttribute, 'trait_type'>, prop2: Pick<NftAttribute, 'trait_type'>) {
  const { trait_type: traitType1 } = prop1;
  const { trait_type: traitType2 } = prop2;

  if (traitType1.toLowerCase() < traitType2.toLowerCase()) {
    return -1;
  }
  if (traitType1.toLowerCase() > traitType2.toLowerCase()) {
    return 1;
  }
  return 0;
}
