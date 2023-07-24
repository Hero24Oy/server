export const convertListToFirebaseMap = (list: string[]) =>
  Object.fromEntries(list.map((item) => [item, true] as const));
