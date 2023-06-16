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
