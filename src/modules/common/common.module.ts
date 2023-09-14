import { Module } from '@nestjs/common';

import { GraphQlContextManagerModule } from '../graphql-context-manager/graphql-context-manager.module';

import { CommonContext } from './common.context';
import { DateScalar } from './common.scalar';

@Module({
  imports: [
    GraphQlContextManagerModule.forFeature({
      contexts: [CommonContext],
    }),
  ],
  providers: [DateScalar],
})
export class CommonModule {}
