import { Injectable } from '@nestjs/common';

import {
  GraphQLBaseContext,
  AppGraphQLContext,
  AppPlatform,
} from 'src/app.types';

import { GraphQLContextProviderService } from '../graphql-context-manager/graphql-context-manager.interface';
import { PLATFORM_SPECIFIER_HEADER_NAME } from './platform-specifier.constants';

@Injectable()
export class PlatformSpecifierContext implements GraphQLContextProviderService {
  async createContext(
    context: GraphQLBaseContext,
  ): Promise<Partial<AppGraphQLContext>> {
    const { req, connectionParams } = context;

    const source: Record<string, string> =
      req?.headers || connectionParams || {};

    const platformValue = source[PLATFORM_SPECIFIER_HEADER_NAME];

    let platform: AppPlatform | null;

    switch (platformValue) {
      case AppPlatform.APP:
      case AppPlatform.STILAUS:
        platform = platformValue;
        break;
      default:
        platform = null;
    }

    return { platform };
  }
}
