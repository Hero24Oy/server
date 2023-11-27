import { InputType, ObjectType, OmitType } from '@nestjs/graphql';

import { FileDataObject } from './data';

@InputType()
@ObjectType()
export class FileDataWithoutStoragePathObject extends OmitType(
  FileDataObject,
  ['storagePath'],
  InputType,
) {}