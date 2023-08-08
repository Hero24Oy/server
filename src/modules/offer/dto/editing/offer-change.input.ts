import { Field, InputType, Int } from '@nestjs/graphql';
import { MaybeType } from 'src/modules/common/common.types';

@InputType()
export class OfferChangeInput {
  @Field(() => Int, { nullable: true })
  agreedStartTime?: MaybeType<number>;
}
