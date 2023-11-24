import { InputType, ObjectType, OmitType } from '@nestjs/graphql';

import { ImageDataObject } from './data';

@ObjectType()
export class ImageDataWithoutStoragePathObject extends OmitType(
  ImageDataObject,
  ['storagePath'],
  InputType,
) {}
