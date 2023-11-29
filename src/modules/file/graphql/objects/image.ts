import { ObjectType } from '@nestjs/graphql';

import { FileObject } from './file';

/**
 * @deprecated `ImageDto` object is legacy, use `FileObject` instead.
 */
@ObjectType()
export class ImageDto extends FileObject {}
