import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class FileDataObject {
  @Field(() => String, { nullable: true })
  name?: MaybeType<string>;

  @Field(() => String, { nullable: true })
  storagePath?: MaybeType<string>;
}
