import { Field, Int, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class ImageDataObject {
  @Field(() => Int)
  width: number;

  @Field(() => Int)
  height: number;

  @Field(() => String, { nullable: true })
  storagePath?: MaybeType<string>;
}
