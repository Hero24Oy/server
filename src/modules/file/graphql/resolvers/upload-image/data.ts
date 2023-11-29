import { InputType, OmitType } from '@nestjs/graphql';

import { FileDataObject } from '../../objects';

/**
 * @deprecated `ImageCreationDataInput` object is legacy, use `UploadFileDataInput` instead.
 */
@InputType()
export class ImageCreationDataInput extends OmitType(
  FileDataObject,
  ['storagePath'],
  InputType,
) {}
