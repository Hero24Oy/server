import { Field, ObjectType } from '@nestjs/graphql';

import { MaybeType } from '$modules/common/common.types';

@ObjectType()
export class PdfDataObject {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  storagePath?: MaybeType<string>;
}
