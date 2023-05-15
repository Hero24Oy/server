import { ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';
import { GraphQLContextProviderService } from './graphql-context-manager.interface';

export type ContextRegistrationOptions = {
  contexts: ParentType<GraphQLContextProviderService>[];
  imports?: ModuleMetadata['imports'];
};
