import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation } from '@nestjs/graphql';

import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

import { PromotionCreationInput } from '../dto/promotion-creation.input';
import { PromotionEditingInput } from '../dto/promotion-editing.input';
import { PromotionDto } from '../dto/promotion.dto';
import { AdminPromotionService } from '../services/admin-promotion.service';

@UseGuards(AdminGuard)
@Resolver()
export class AdminPromotionResolver {
  constructor(private readonly adminPromotionService: AdminPromotionService) {}

  @Mutation(() => PromotionDto)
  createPromotion(
    @Args('input') input: PromotionCreationInput,
  ): Promise<PromotionDto> {
    return this.adminPromotionService.createPromotion(input);
  }

  @Mutation(() => PromotionDto)
  editPromotion(
    @Args('input') input: PromotionEditingInput,
  ): Promise<PromotionDto> {
    return this.adminPromotionService.updatePromotion(input);
  }

  @Mutation(() => Boolean)
  removePromotion(@Args('id') id: string): Promise<boolean> {
    return this.adminPromotionService.deletePromotion(id);
  }
}
