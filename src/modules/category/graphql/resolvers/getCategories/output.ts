import { Field, ObjectType } from '@nestjs/graphql';

import { CategoryObject } from '../../objects';

@ObjectType()
export class GetCategoriesOutput {
  @Field(() => CategoryObject)
  category: CategoryObject;
}
