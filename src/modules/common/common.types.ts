export type MaybeType<T> = T | null | undefined;

export type OmitValue<T extends Record<string, unknown>, Value> = {
  [Key in keyof T]: T[Key] extends Value ? never : T[Key];
};
