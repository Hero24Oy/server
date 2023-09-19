export type OptionalKeys<Type> = {
  [Key in keyof Type]-?: object extends Pick<Type, Key> ? Key : never;
}[keyof Type];
