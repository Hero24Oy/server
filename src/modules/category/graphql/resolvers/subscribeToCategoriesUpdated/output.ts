import { Field, ObjectType } from '@nestjs/graphql';

import { CategoryObject } from '../../objects';

@ObjectType()
export class SubscribeToCategoriesUpdatedOutput {
  @Field(() => CategoryObject)
  category: CategoryObject;
}
