import { registerEnumType } from '@nestjs/graphql';

export enum HeroPortfolioOrderColumn {
  ID = 'id',
  CATEGORY_ID = 'categoryId',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(HeroPortfolioOrderColumn, {
  name: 'HeroPortfolioOrderColumn',
});
