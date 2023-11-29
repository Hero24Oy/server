import { createUnionType } from '@nestjs/graphql';
import {
  MangoPayHero,
  MangoPayProfessionalHeroType,
  MangoPayUserType,
} from 'hero24-types';

import { MangopayBusinessHeroObject } from './business-hero';
import { MangopayIndividualHeroObject } from './individual-hero';
import { MangopaySoletraderHeroObject } from './soletrader-hero';

export const MangopayHeroObject = createUnionType({
  name: 'MangopayCustomerObject',
  types: () =>
    [
      MangopayIndividualHeroObject,
      MangopayBusinessHeroObject,
      MangopaySoletraderHeroObject,
    ] as const,
  resolveType: (hero: MangoPayHero) => {
    if (hero.type === MangoPayUserType.INDIVIDUAL) {
      return MangopayIndividualHeroObject;
    }

    if (hero.professionalType === MangoPayProfessionalHeroType.BUSINESS) {
      return MangopayBusinessHeroObject;
    }

    return MangopaySoletraderHeroObject;
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare -- we need to create type for the union instead of using typeof
export type MangopayHeroObject = typeof MangopayHeroObject;
