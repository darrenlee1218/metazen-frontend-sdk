export const mockImport = <T extends (...args: any[]) => any>(_import: T) => {
  return _import as jest.MockedFunction<T>;
};
