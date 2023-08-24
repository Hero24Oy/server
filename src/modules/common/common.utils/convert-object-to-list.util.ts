export const convertObjectToList = <T extends Record<string, any>>(
  object: T,
): Array<any> => {
  return Object.entries(object).map(([id, rest]) => ({ id, ...rest }));
};
