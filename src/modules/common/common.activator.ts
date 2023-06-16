import { SetMetadata } from '@nestjs/common';

export const CommonActivator = <T>(metadataKey: string, value: T) =>
  SetMetadata(metadataKey, value);
