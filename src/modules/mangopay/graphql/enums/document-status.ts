import { registerEnumType } from '@nestjs/graphql';
import { DocumentStatus } from 'hero24-types';

export const documentStatusEnum = registerEnumType(DocumentStatus, {
  name: 'DocumentStatus',
});
