import { InputType, OmitType } from '@nestjs/graphql';

import { ImageDataObject } from '../objects/image/data';

@InputType()
export class ImageCreationDataInput extends OmitType(
  ImageDataObject,
  ['storagePath'],
  InputType,
) {}
