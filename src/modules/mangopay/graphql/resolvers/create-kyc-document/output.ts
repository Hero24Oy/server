import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateKycDocumentOutput {
  @Field(() => String)
  kycDocumentId: string;
}
