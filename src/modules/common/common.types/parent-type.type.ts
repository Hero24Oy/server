// eslint-disable-next-line @typescript-eslint/no-explicit-any -- we need any here
export type ParentType<Type, Args extends unknown[] = any[]> = {
  new (...args: Args): Type;
};
