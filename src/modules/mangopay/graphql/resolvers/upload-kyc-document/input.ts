import { Field, InputType } from '@nestjs/graphql';

import { KycType } from '$modules/mangopay/enums';

@InputType()
export class UploadKycDocumentInput {
  @Field(() => KycType)
  type: KycType;

  @Field(() => String)
  base64: string;
}
