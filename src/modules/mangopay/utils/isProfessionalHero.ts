import {
  MangoPayBusinessHero,
  MangoPayHero,
  MangoPaySoletraderHero,
  MangoPayUserType,
} from 'hero24-types';

export const isProfessionalHero = (
  hero: MangoPayHero,
): hero is MangoPaySoletraderHero | MangoPayBusinessHero => {
  return hero.type === MangoPayUserType.PROFESSIONAL;
};
