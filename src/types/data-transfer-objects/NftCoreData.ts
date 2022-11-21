export interface NftAttribute {
  trait_type: string;
  value: string;
  display_type: string;
  max_value?: number;
}

export interface NftCoreData {
  core: {
    chassisNumber: string;
    item: string;
    livery: string;
    handling: string;
    acceleration: string;
    topSpeed: string;
    weight: string;
    year: string;
    rarity: string;
    class: string;
    collection: string;
    manufacturer: string;
    type: string;
    nfFlag: string;
  };
  type: string;
  manufacturer: string;
  collection: string;
  class: string;
  rarity: string;
  year: number;
  racing_topSpeed: number;
  racing_acceleration: number;
  racing_handling: number;
  name: string;
  description: string;
  image: string;
  id: string;
  attributes: NftAttribute[];
  external_url: string;
}
