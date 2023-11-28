import { InputType, OmitType } from '@nestjs/graphql';

import { FileDataObject } from '../../objects';

@InputType()
export class UploadFileDataInput extends OmitType(
  FileDataObject,
  ['storagePath'],
  InputType,
) {}
