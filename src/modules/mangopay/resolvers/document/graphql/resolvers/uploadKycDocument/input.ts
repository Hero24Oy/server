import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { KycType } from '$modules/mangopay/enums';

registerEnumType(KycType, {
  name: 'KycType',
});

@InputType()
export class UploadKycDocumentInput {
  @Field(() => String)
  userId: string;

  @Field(() => KycType)
  type: KycType;

  @Field(() => String)
  base64: string;
}
