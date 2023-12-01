import { Field, InputType } from '@nestjs/graphql';

import { MangopayBeneficialOwnerObject } from '../../objects';

@InputType()
export class UploadUboDocumentInput {
  @Field(() => [MangopayBeneficialOwnerObject])
  beneficialOwners: MangopayBeneficialOwnerObject[];
}
