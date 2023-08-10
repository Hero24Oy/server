export const convertListToObjects = (list) => {
  return list.reduce((acc, obj) => {
    const { id, ...rest } = obj;
    acc[id] = rest;
    return acc;
  }, {} as Record<string, any>);
};
