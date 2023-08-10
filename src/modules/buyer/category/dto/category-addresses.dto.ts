import { Field, ObjectType } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

@ObjectType()
export class CategoryAddressesDto {
  @Field(() => Boolean, { nullable: true })
  main: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  from: MaybeType<boolean>;

  @Field(() => Boolean, { nullable: true })
  to: MaybeType<boolean>;
}
