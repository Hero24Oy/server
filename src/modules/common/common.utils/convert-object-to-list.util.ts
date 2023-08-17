export const convertObjectToList = <T extends Record<string, any>>(
  object: T,
): Array<{ id: string } & T> => {
  return Object.entries(object).map(([id, rest]) => ({ id, ...rest }));
};
