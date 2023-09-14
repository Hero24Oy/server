import { AppGraphQlContext, GraphQlBaseContext } from 'src/app.types';

export interface GraphQlContextProviderService {
  createContext(ctx: GraphQlBaseContext): Promise<Partial<AppGraphQlContext>>;
}
