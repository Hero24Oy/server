export type EnumToString<T> = T extends `${infer S}` ? S : never;
