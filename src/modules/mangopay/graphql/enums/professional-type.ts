import { registerEnumType } from '@nestjs/graphql';
import { MangoPayProfessionalHeroType } from 'hero24-types';

export const professionalTypeEnum = registerEnumType(
  MangoPayProfessionalHeroType,
  {
    name: 'MangoPayProfessionalHeroType',
  },
);
