import { Observable } from 'rxjs';

import { AppGraphQLContext } from 'src/app.types';

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

export type BaseGuardActivator<
  Args extends object,
  Providers extends Record<string, unknown>,
> = (
  args: Args,
  context: AppGraphQLContext,
  providers: Providers,
) => boolean | Promise<boolean>;

export interface Adapter<InternalType, ExternalType> {
  toExternal(internal: InternalType): ExternalType;
  toInternal(external: ExternalType): InternalType;
}

export type OptionalKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type TypeSafeRequired<T> = Omit<T, OptionalKeys<T>> & {
  [Key in OptionalKeys<T>]: T[Key] | undefined;
};

export type EnumToString<T> = T extends `${infer S}` ? S : never;
