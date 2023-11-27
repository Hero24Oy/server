import { InputType, ObjectType, OmitType } from '@nestjs/graphql';

import { FileDataObject } from './data';

@InputType('FileDataWithoutStoragePathInput')
@ObjectType('FileDataWithoutStoragePathObject')
export class FileDataWithoutStoragePath extends OmitType(
  FileDataObject,
  ['storagePath'],
  InputType,
) {}
