import { Field, ObjectType } from '@nestjs/graphql';

import { FileObject } from '../file';

import { PdfDataObject } from './data';

@ObjectType()
export class PdfObject extends FileObject {
  @Field(() => PdfDataObject)
  data: PdfDataObject;
}
