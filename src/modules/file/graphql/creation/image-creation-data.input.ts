import { InputType, OmitType } from '@nestjs/graphql';

import { ImageDataDto } from '../objects/image/data';

@InputType()
export class ImageCreationDataInput extends OmitType(
  ImageDataDto,
  ['storagePath'],
  InputType,
) {}
