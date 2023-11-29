import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UploadKycPageInput {
  @Field(() => String)
  kycDocumentId: string;

  @Field(() => String)
  base64: string;
}
