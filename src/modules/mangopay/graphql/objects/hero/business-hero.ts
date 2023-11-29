import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentStatus, MangoPayProfessionalHeroType } from 'hero24-types';

import { MangopayBusinessDocumentsObject } from '../documents';

import { MangopayProfessionalHeroObject } from './professional-hero';

@ObjectType()
export class MangopayBusinessHeroObject extends MangopayProfessionalHeroObject {
  @Field(() => MangoPayProfessionalHeroType)
  professionalType: MangoPayProfessionalHeroType.BUSINESS;

  @Field(() => MangopayBusinessDocumentsObject)
  kycStatus: MangopayBusinessDocumentsObject;

  @Field(() => DocumentStatus)
  uboStatus: DocumentStatus;
}
