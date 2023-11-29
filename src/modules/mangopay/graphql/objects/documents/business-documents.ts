import { Field, ObjectType } from '@nestjs/graphql';
import { KycTypes } from 'hero24-types';

import { MangopayKycDocumentObject } from './kyc-document';

@ObjectType()
export class MangopayBusinessDocumentsObject {
  @Field(() => MangopayKycDocumentObject)
  [KycTypes.IDENTITY_PROOF]: MangopayKycDocumentObject;

  @Field(() => MangopayKycDocumentObject)
  [KycTypes.REGISTRATION_PROOF]: MangopayKycDocumentObject;

  @Field(() => MangopayKycDocumentObject)
  [KycTypes.ARTICLES_OF_ASSOCIATION]: MangopayKycDocumentObject;

  @Field(() => MangopayKycDocumentObject)
  [KycTypes.SHAREHOLDER_DECLARATION]: MangopayKycDocumentObject;
}
