// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParentType<T, Args extends unknown[] = any[]> = {
  new (...args: Args): T;
};
