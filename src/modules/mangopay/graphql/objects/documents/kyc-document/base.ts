import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentStatus } from 'hero24-types';

@ObjectType()
export class MangopayBaseKycDocumentObject {
  @Field(() => DocumentStatus)
  status: DocumentStatus;
}
