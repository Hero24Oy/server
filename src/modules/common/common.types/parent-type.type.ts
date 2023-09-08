export type ParentType<T, Args extends unknown[] = any[]> = {
  new (...args: Args): T;
};
