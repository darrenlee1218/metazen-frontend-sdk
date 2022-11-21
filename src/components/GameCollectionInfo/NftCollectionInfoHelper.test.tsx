import { filterByDisplayType, sortByTraitType } from './NftCollectionInfoHelper';

describe('test filterByDisplayType', () => {
  it('should return data filtered by boosts type', () => {
    const attributes = [
      {
        trait_type: 'rarity',
        value: 'Common',
      },
      {
        trait_type: 'class',
        value: 'Sports Saloon',
      },
      {
        trait_type: 'manufacturer',
        value: 'REVV Motorsport from REVV org',
      },
      {
        trait_type: 'type',
        value: 'Car',
      },
      {
        trait_type: 'collection',
        value: 'Odaily',
      },
      {
        trait_type: 'weight',
        value: '1464kg',
      },
      {
        trait_type: 'chassis_number',
        value: '29537',
      },
      {
        display_type: 'boost_number',
        trait_type: 'top_speed',
        value: 100,
        max_value: 1001,
      },
      {
        display_type: 'boost_number',
        trait_type: 'acceleration',
        value: 500,
        max_value: 1001,
      },
      {
        display_type: 'boost_number',
        trait_type: 'handling',
        value: 900,
        max_value: 1001,
      },
    ];
    const { nftAssetBoosts, nftAssetProperties } = filterByDisplayType(attributes as any);
    expect(nftAssetBoosts.length).toBe(3);
    expect(nftAssetProperties.length).toBe(7);
    const expectedAssetBoosts = [
      {
        display_type: 'boost_number',
        trait_type: 'top speed',
        value: 100,
        max_value: 1001,
      },
      {
        display_type: 'boost_number',
        trait_type: 'acceleration',
        value: 500,
        max_value: 1001,
      },
      {
        display_type: 'boost_number',
        trait_type: 'handling',
        value: 900,
        max_value: 1001,
      },
    ];
    expect(nftAssetBoosts).toEqual(expectedAssetBoosts);
  });
});

describe('test sortByTraitType', () => {
  it('should return data sorted by TraitType', () => {
    const expectedArray = [
      {
        trait_type: 'avg',
        value: '29537',
      },
      {
        trait_type: 'chassis_number',
        value: '29537',
      },
      {
        trait_type: 'class',
        value: 'Sports Saloon',
      },
      {
        trait_type: 'collection',
        value: 'Odaily',
      },
      {
        trait_type: 'manufacturer',
        value: 'REVV Motorsport from REVV org',
      },
      {
        trait_type: 'rarity',
        value: 'Common',
      },
      {
        trait_type: 'type',
        value: 'Car',
      },

      {
        trait_type: 'weight',
        value: '1464kg',
      },
    ];
    const inputArray = [
      {
        trait_type: 'avg',
        value: '29537',
      },
      {
        trait_type: 'rarity',
        value: 'Common',
      },
      {
        trait_type: 'class',
        value: 'Sports Saloon',
      },
      {
        trait_type: 'manufacturer',
        value: 'REVV Motorsport from REVV org',
      },
      {
        trait_type: 'type',
        value: 'Car',
      },
      {
        trait_type: 'collection',
        value: 'Odaily',
      },
      {
        trait_type: 'weight',
        value: '1464kg',
      },
      {
        trait_type: 'chassis_number',
        value: '29537',
      },
    ];
    expect(inputArray.sort(sortByTraitType)).toEqual(expectedArray as any);
  });
});
