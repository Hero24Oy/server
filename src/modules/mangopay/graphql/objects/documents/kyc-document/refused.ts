import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentStatus } from 'hero24-types';

@ObjectType()
export class MangopayRefusedKycDocumentObject {
  @Field(() => DocumentStatus)
  status: DocumentStatus.REFUSED;

  @Field(() => String)
  reason: string;
}
