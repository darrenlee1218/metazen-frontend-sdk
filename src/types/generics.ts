export type Comparator<T> = (a: T, b: T) => number;

/**
 * Use case, when var === undefined, render loading component
 */
export type Loadable<T> = T | undefined;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
