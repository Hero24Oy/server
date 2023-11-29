import { registerEnumType } from '@nestjs/graphql';

export enum MimeType {
  PNG = 'image/png',
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  PDF = 'application/pdf',
}

registerEnumType(MimeType, {
  name: 'MimeType',
});
