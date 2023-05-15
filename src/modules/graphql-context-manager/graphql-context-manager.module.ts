import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';
import { GraphQLContextProviderService } from './graphql-context-manager.interface';
import { GraphQLContextManagerService } from './graphql-context-manager.service';
import { ContextRegistrationOptions } from './graphql-context-manager.types';

@Module({})
export class GraphQLContextManagerModule {
  private static imports: Required<ModuleMetadata>['imports'] = [];
  private static contextProviderServices: ParentType<GraphQLContextProviderService>[] =
    [];

  static forFeature(options: ContextRegistrationOptions): DynamicModule {
    const { contexts, imports = [] } = options;
    GraphQLContextManagerModule.contextProviderServices.push(...contexts);

    GraphQLContextManagerModule.imports.push(...imports);

    return {
      module: GraphQLContextManagerModule,
      imports,
      providers: contexts,
      exports: contexts,
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: GraphQLContextManagerModule,
      imports: GraphQLContextManagerModule.imports,
      providers: [
        {
          provide: GraphQLContextManagerService,
          inject: GraphQLContextManagerModule.contextProviderServices,
          useFactory: (
            ...contextProviders: GraphQLContextProviderService[]
          ) => {
            return new GraphQLContextManagerService(...contextProviders);
          },
        },
        ...GraphQLContextManagerModule.contextProviderServices,
      ],
      exports: [
        {
          provide: GraphQLContextManagerService,
          useExisting: GraphQLContextManagerService,
        },
      ],
    };
  }
}
