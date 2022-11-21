import { ConditionalKeys } from 'type-fest';

export const keyBy = <T extends object, U extends ConditionalKeys<T, string | number>>(
  array: T[],
  key: U,
): Record<string | number, T> => {
  return array.reduce<Record<string | number, T>>((result, item) => {
    result[item[key] as unknown as string | number] = item;
    return result;
  }, {});
};
