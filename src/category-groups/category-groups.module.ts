import { Module } from '@nestjs/common';

import { CategoryGroupsResolver } from './category-groups.resolver';
import { CategoryGroupsService } from './category-groups.service';

import { FirebaseModule } from '$modules/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [CategoryGroupsResolver, CategoryGroupsService],
  exports: [CategoryGroupsService],
})
export class CategoryGroupsModule {}
