import { AppGraphQlContext, GraphQlBaseContext } from '$/app.types';

export interface GraphQlContextProviderService {
  createContext(ctx: GraphQlBaseContext): Promise<Partial<AppGraphQlContext>>;
}
