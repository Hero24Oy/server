import { Field, ObjectType } from '@nestjs/graphql';

import { CategoryObject } from '../../objects';

@ObjectType()
export class SubscribeToCategoriesCreatedOutput {
  @Field(() => CategoryObject)
  category: CategoryObject;
}
