import { registerEnumType } from '@nestjs/graphql';
import { MangoPayUserType } from 'hero24-types';

export const mangoPayUserTypeEnum = registerEnumType(MangoPayUserType, {
  name: 'MangoPayUserType',
});
