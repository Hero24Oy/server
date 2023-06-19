import { Module } from '@nestjs/common';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { PlatformSpecifierContext } from './platform-specifier.context';

@Module({
  imports: [
    GraphQLContextManagerModule.forFeature({
      contexts: [PlatformSpecifierContext],
    }),
  ],
})
export class PlatformSpecifierModule {}
