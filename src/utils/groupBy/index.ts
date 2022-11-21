import { ConditionalKeys } from 'type-fest';

export const groupBy = <T extends object, U extends ConditionalKeys<T, string | number>>(
  array: T[],
  key: U,
): Record<string | number, T[]> => {
  return array.reduce<Record<string | number, T[]>>((result, item) => {
    const value = item[key] as unknown as string | number;

    if (value in result) result[value].push(item);
    else result[value] = [item];

    return result;
  }, {});
};
