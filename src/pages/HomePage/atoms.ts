import { atom, PrimitiveAtom } from 'jotai';
import { AssetTabItem } from './AssetTypeTabs';

export const tabAtom = atom(AssetTabItem.GameTokens);
const otherTokensExpanded = atom(false);
const otherCollectionsExpanded = atom(false);

const createToggleAtom = (primitive: PrimitiveAtom<boolean>) =>
  atom(
    (get) => get(primitive),
    (get, set) => set(primitive, !get(primitive)),
  );

export const toggleOtherTokens = createToggleAtom(otherTokensExpanded);
export const toggleOtherCollections = createToggleAtom(otherCollectionsExpanded);
