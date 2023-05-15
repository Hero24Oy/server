import { Module } from '@nestjs/common';
import { DateScalar } from './common.scalar';
import { GraphQLContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';
import { CommonContext } from './common.context';

@Module({
  imports: [
    GraphQLContextManagerModule.forFeature({
      contexts: [CommonContext],
    }),
  ],
  providers: [DateScalar],
})
export class CommonModule {}
