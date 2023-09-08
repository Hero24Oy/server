export type DeeplyNonNullable<
  Type,
  Keys extends keyof Type = keyof Type,
> = Type extends object
  ? {
      [Key in Keys]-?: NonNullable<Type[Key]>;
    }
  : never;
