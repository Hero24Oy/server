import {
  MangoPayBusinessHero,
  MangoPayHero,
  MangoPayProfessionalHeroType,
  MangoPayUserType,
} from 'hero24-types';

export const isBusinessHero = (
  hero: MangoPayHero,
): hero is MangoPayBusinessHero => {
  return (
    hero.type === MangoPayUserType.PROFESSIONAL &&
    hero.professionalType === MangoPayProfessionalHeroType.BUSINESS
  );
};
