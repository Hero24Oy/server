import { Field, InputType } from '@nestjs/graphql';

import { BeneficialOwnerObject } from '../../objects';

@InputType()
export class UploadUboDocumentInput {
  @Field(() => String)
  userId: string;

  @Field(() => [BeneficialOwnerObject])
  beneficialOwners: BeneficialOwnerObject[];
}
