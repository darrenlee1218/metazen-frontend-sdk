export const assertNever = (value: never) => {
  return new Error(`Faled into never case: ${value}`);
};
