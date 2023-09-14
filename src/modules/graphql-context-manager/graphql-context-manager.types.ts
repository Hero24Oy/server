import { ModuleMetadata } from '@nestjs/common';

import { ParentType } from '../common/common.types';

import { GraphQlContextProviderService } from './graphql-context-manager.interface';

export type ContextRegistrationOptions = {
  contexts: ParentType<GraphQlContextProviderService>[];
  imports?: ModuleMetadata['imports'];
};
