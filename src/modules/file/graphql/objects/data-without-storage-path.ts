import { InputType, ObjectType, OmitType } from '@nestjs/graphql';

import { FileDataObject } from './data';

@ObjectType()
export class ImageDataWithoutStoragePathObject extends OmitType(
  FileDataObject,
  ['storagePath'],
  InputType,
) {}
