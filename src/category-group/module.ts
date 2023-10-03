import { Module } from '@nestjs/common';

import { CategoryGroupsResolver, CategoryGroupsService } from '.';
import { FirebaseModule } from '$modules/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [CategoryGroupsResolver, CategoryGroupsService],
  exports: [CategoryGroupsService],
})
export class CategoryGroupsModule {}
