import { UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { CategoryGroupDto } from './dto';
import { CategoryGroupService } from './service';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
export class CategoryGroupResolver {
  constructor(private readonly categoryGroupService: CategoryGroupService) {}

  @Query(() => [CategoryGroupDto])
  @UseGuards(AuthGuard)
  @UseFilters(FirebaseExceptionFilter)
  async categoryGroups(): Promise<CategoryGroupDto[]> {
    return this.categoryGroupService.getCategoryList();
  }
}
