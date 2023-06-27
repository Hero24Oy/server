import { AppGraphQLContext } from 'src/app.types';

export type BaseGuardActivator<
  Args extends object,
  Providers extends Record<string, unknown>,
> = (
  args: Args,
  context: AppGraphQLContext,
  providers: Providers,
) => boolean | Promise<boolean>;
