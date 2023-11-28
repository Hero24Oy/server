import { InputType, OmitType } from '@nestjs/graphql';

import { ImageDataDto } from '../image/image-data.dto';

@InputType()
export class ImageCreationDataInput extends OmitType(
  ImageDataDto,
  ['storagePath'],
  InputType,
) {}
