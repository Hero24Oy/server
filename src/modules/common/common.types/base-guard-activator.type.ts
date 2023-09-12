import { AppGraphQlContext } from 'src/app.types';

export type BaseGuardActivator<
  Args extends object,
  Providers extends Record<string, unknown>,
> = (
  args: Args,
  context: AppGraphQlContext,
  providers: Providers,
) => boolean | Promise<boolean>;
