import { Module } from '@nestjs/common';

import { CategoryGroupResolver, CategoryGroupService } from '.';
import { FirebaseModule } from '$modules/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [CategoryGroupResolver, CategoryGroupService],
  exports: [CategoryGroupService],
})
export class CategoryGroupModule {}
