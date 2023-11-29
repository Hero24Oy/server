import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayProfessionalHeroType } from 'hero24-types';

import {
  MangopayBusinessDocumentsObject,
  MangopaySoletraderDocumentsObject,
} from '../documents';

import { MangopayProfessionalHeroObject } from './professional-hero';

@ObjectType()
export class MangopaySoletraderHeroObject extends MangopayProfessionalHeroObject {
  @Field(() => MangoPayProfessionalHeroType)
  professionalType: MangoPayProfessionalHeroType.SOLETRADER;

  @Field(() => MangopayBusinessDocumentsObject)
  kycStatus: MangopaySoletraderDocumentsObject;
}
