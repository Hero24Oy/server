import { Field, Int, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class FileDataObject {
  @Field(() => Int, { nullable: true })
  width?: MaybeType<number>;

  @Field(() => Int, { nullable: true })
  height?: MaybeType<number>;

  @Field(() => String, { nullable: true })
  name?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  storagePath?: MaybeType<string>;
}
