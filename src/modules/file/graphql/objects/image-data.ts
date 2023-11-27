import { ObjectType } from '@nestjs/graphql';

import { FileDataObject } from './data';

/**
 * @deprecated `ImageDataDto` object is legacy, use `FileDataObject` instead.
 */
@ObjectType()
export class ImageDataDto extends FileDataObject {}
