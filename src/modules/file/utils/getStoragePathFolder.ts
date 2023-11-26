import { MimeType } from '../graphql';
import { MimeTypeGroup } from '../types';

const storagePathMapper: Record<MimeTypeGroup, string> = {
  [MimeTypeGroup.IMAGE]: 'images',
  [MimeTypeGroup.APPLICATION]: 'documents',
};

// * We are sure that storage path folder must be found.
export const getStoragePathFolder = (mime: MimeType): string => {
  return Object.entries(storagePathMapper)
    .filter(([key]) => mime.includes(key))
    .map(([_key, value]) => value)
    .at(0) as string;
};
