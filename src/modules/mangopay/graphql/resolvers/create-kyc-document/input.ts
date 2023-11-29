import { Field, InputType } from '@nestjs/graphql';

import { KycType } from '$modules/mangopay/enums';

@InputType()
export class CreateKycDocumentInput {
  @Field(() => KycType)
  type: KycType;
}
