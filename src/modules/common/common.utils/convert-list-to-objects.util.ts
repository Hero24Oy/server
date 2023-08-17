export const convertListToObjects = <T extends { id: string }>(
  list: T[],
): Record<string, Omit<T, 'id'>> => {
  return list.reduce((acc, obj) => {
    const { id, ...rest } = obj;
    acc[id] = rest;
    return acc;
  }, {});
};