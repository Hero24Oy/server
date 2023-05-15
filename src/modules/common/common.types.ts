import { Observable } from 'rxjs';

export type MaybeType<T> = T | null | undefined;

export type OmitValue<T extends Record<string, unknown>, Value> = {
  [Key in keyof T]: T[Key] extends Value ? never : T[Key];
};

export type TargetPartial<T, Fields extends keyof T> = Omit<T, Fields> &
  Partial<Pick<T, Fields>>;

export type ParentType<T, Args extends unknown[] = any[]> = {
  new (...args: Args): T;
};

export type GuardBoolean = boolean | Promise<boolean> | Observable<boolean>;
