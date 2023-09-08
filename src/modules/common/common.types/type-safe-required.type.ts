import { OptionalKeys } from './optional-keys.type';

export type TypeSafeRequired<T> = Omit<T, OptionalKeys<T>> & {
  [Key in OptionalKeys<T>]: T[Key] | undefined;
};
