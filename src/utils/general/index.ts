// Can not fix because return type is different per used function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getJsonValue = (object: Object, key?: string): any => {
  if (!key) throw new Error(`no key provided for getJsonValue`);
  let obj: Object = object;
  const keys = key.split('.');
  for (const k of keys) {
    if (k in obj) {
      obj = obj[k as keyof Object];
    } else {
      throw new Error(`Invalid json path for getJsonValue`);
    }
  }
  return obj;
};
