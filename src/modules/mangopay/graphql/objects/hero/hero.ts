import { createUnionType } from '@nestjs/graphql';
import {
  MangoPayBusinessHero,
  MangoPayHero,
  MangoPayIndividualHero,
  MangoPayProfessionalHeroType,
  MangoPaySoletraderHero,
  MangoPayUserType,
} from 'hero24-types';

import { MangopayBusinessHeroObject } from './business-hero';
import { MangopayIndividualHeroObject } from './individual-hero';
import { MangopaySoletraderHeroObject } from './soletrader-hero';

import { assertNever } from '$modules/common/common.utils';
import { FirebaseAdapter } from '$modules/firebase/firebase.adapter';

export const MangopayHeroObject = createUnionType({
  name: 'MangopayHeroObject',
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

export const MangopayHeroObjectAdapter = new FirebaseAdapter<
  MangoPayHero,
  MangopayHeroObject
>({
  toExternal: (internal: MangoPayHero) => {
    switch (internal.type) {
      case MangoPayUserType.INDIVIDUAL:
        return {
          type: internal.type,
          companyRepresentativeId: internal.companyRepresentativeId,
        } as MangopayIndividualHeroObject;
      case MangoPayUserType.PROFESSIONAL:
        switch (internal.professionalType) {
          case MangoPayProfessionalHeroType.BUSINESS:
            return {
              id: internal.id,
              walletId: internal.walletId,
              type: internal.type,
              businessOwner: internal.businessOwner,
              kycStatus: internal.kycStatus,
              uboStatus: internal.uboStatus,
              professionalType: internal.professionalType,
              bankId: internal.bankId,
            } as MangoPayBusinessHero;
          case MangoPayProfessionalHeroType.SOLETRADER:
            return {
              id: internal.id,
              walletId: internal.walletId,
              type: internal.type,
              businessOwner: internal.businessOwner,
              kycStatus: internal.kycStatus,
              professionalType: internal.professionalType,
              bankId: internal.bankId,
            } as MangoPaySoletraderHero;
          default:
            assertNever(internal);
        }
      // eslint-disable-next-line no-fallthrough -- we don't need break here because code is unreachable
      default:
        assertNever(internal);
    }
  },
  toInternal: (external: MangopayHeroObject) => {
    switch (external.type) {
      case MangoPayUserType.INDIVIDUAL:
        return {
          type: external.type,
          companyRepresentativeId: external.companyRepresentativeId,
        } as MangoPayIndividualHero;
      case MangoPayUserType.PROFESSIONAL:
        switch (external.professionalType) {
          case MangoPayProfessionalHeroType.BUSINESS:
            return {
              id: external.id,
              walletId: external.walletId,
              type: external.type,
              businessOwner: external.businessOwner,
              kycStatus: external.kycStatus,
              uboStatus: external.uboStatus,
              professionalType: external.professionalType,
              bankId: external.bankId ?? undefined,
            } as MangoPayBusinessHero;
          case MangoPayProfessionalHeroType.SOLETRADER:
            return {
              id: external.id,
              walletId: external.walletId,
              type: external.type,
              businessOwner: external.businessOwner,
              kycStatus: external.kycStatus,
              professionalType: external.professionalType,
              bankId: external.bankId ?? undefined,
            } as MangoPaySoletraderHero;
          default:
            assertNever(external);
        }
      // eslint-disable-next-line no-fallthrough -- we don't need break here because code is unreachable
      default:
        assertNever(external);
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare -- we need to create type for the union instead of using typeof
export type MangopayHeroObject = typeof MangopayHeroObject;
