import { Field, ObjectType } from '@nestjs/graphql';
import { KycTypes } from 'hero24-types';

import { MangopayKycDocumentObject } from './kyc-document';

@ObjectType()
export class MangopaySoletraderDocumentsObject {
  @Field(() => MangopayKycDocumentObject)
  [KycTypes.IDENTITY_PROOF]: MangopayKycDocumentObject;

  @Field(() => MangopayKycDocumentObject)
  [KycTypes.REGISTRATION_PROOF]: MangopayKycDocumentObject;
}
