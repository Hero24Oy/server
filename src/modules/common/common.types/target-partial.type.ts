export type TargetPartial<T, Fields extends keyof T> = Omit<T, Fields> &
  Partial<Pick<T, Fields>>;
