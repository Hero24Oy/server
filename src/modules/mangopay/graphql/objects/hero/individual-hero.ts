import { Field, ObjectType } from '@nestjs/graphql';
import { MangoPayUserType } from 'hero24-types';

@ObjectType()
export class MangopayIndividualHeroObject {
  @Field(() => String)
  type: MangoPayUserType.INDIVIDUAL;

  @Field(() => String)
  companyRepresentativeId: string;
}
