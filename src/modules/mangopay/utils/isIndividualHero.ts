import {
  MangoPayHero,
  MangoPayIndividualHero,
  MangoPayUserType,
} from 'hero24-types';

export const isIndividualHero = (
  hero: MangoPayHero,
): hero is MangoPayIndividualHero => {
  return hero.type === MangoPayUserType.INDIVIDUAL;
};
