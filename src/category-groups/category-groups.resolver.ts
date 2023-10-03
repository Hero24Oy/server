import { UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { CategoryGroupsService } from './category-groups.service';
import { CategoryGroupDto } from './dto/category-group-dto';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
export class CategoryGroupsResolver {
  constructor(private categoryGroupsService: CategoryGroupsService) {}

  @Query(() => [CategoryGroupDto])
  @UseGuards(AuthGuard)
  @UseFilters(FirebaseExceptionFilter)
  async categoryGroups(): Promise<CategoryGroupDto[]> {
    return this.categoryGroupsService.getCategoryList();
  }
}
