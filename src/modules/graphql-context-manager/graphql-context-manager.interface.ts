import { AppGraphQLContext, GraphQLBaseContext } from 'src/app.types';

export interface GraphQLContextProviderService {
  createContext(ctx: GraphQLBaseContext): Promise<Partial<AppGraphQLContext>>;
}
