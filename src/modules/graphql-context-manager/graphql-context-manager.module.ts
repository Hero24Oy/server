import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';

import { GraphQlContextProviderService } from './graphql-context-manager.interface';
import { GraphQlContextManagerService } from './graphql-context-manager.service';
import { ContextRegistrationOptions } from './graphql-context-manager.types';

@Module({})
export class GraphQlContextManagerModule {
  private static imports: Required<ModuleMetadata>['imports'] = [];

  private static contextProviderServices: ParentType<GraphQlContextProviderService>[] =
    [];

  static forFeature(options: ContextRegistrationOptions): DynamicModule {
    const { contexts, imports = [] } = options;

    GraphQlContextManagerModule.contextProviderServices.push(...contexts);

    GraphQlContextManagerModule.imports.push(...imports);

    return {
      module: GraphQlContextManagerModule,
      imports,
      providers: contexts,
      exports: contexts,
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: GraphQlContextManagerModule,
      imports: GraphQlContextManagerModule.imports,
      providers: [
        {
          provide: GraphQlContextManagerService,
          inject: GraphQlContextManagerModule.contextProviderServices,
          useFactory: (
            ...contextProviders: GraphQlContextProviderService[]
          ) => {
            return new GraphQlContextManagerService(...contextProviders);
          },
        },
        ...GraphQlContextManagerModule.contextProviderServices,
      ],
      exports: [
        {
          provide: GraphQlContextManagerService,
          useExisting: GraphQlContextManagerService,
        },
      ],
    };
  }
}
