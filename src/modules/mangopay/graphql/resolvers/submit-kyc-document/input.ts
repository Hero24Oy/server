import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SubmitKycDocumentInput {
  @Field(() => String)
  kycDocumentId: string;
}
