import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MangopayCardService } from '../../services/card';

import {
  DeactivateCardInput,
  GetCardInput,
  GetCardOutput,
  GetCardRegistrationInput,
  GetCardRegistrationOutput,
  UpdateCardRegistrationInput,
  UpdateCardRegistrationOutput,
} from './graphql';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayCardResolver {
  constructor(private readonly cardService: MangopayCardService) {}

  @Query(() => GetCardRegistrationOutput)
  async getCardRegistrationData(
    @Args('input') input: GetCardRegistrationInput,
  ): Promise<GetCardRegistrationOutput> {
    return {
      cardRegistration: await this.cardService.createCardRegistration({
        UserId: input.userId,
      }),
    };
  }

  @Mutation(() => GetCardRegistrationOutput)
  async updateCardRegistrationData(
    @Args('input') input: UpdateCardRegistrationInput,
  ): Promise<UpdateCardRegistrationOutput> {
    return {
      cardRegistration: await this.cardService.updateCardRegistration({
        Id: input.cardId,
        RegistrationData: input.cardData,
      }),
    };
  }

  @Mutation(() => Boolean)
  async getCard(@Args('input') input: GetCardInput): Promise<GetCardOutput> {
    return { card: await this.cardService.getCardById(input.cardId) };
  }

  @Mutation(() => Boolean)
  async deactivateCard(
    @Args('input') input: DeactivateCardInput,
  ): Promise<boolean> {
    try {
      await this.cardService.deactivateCardById(input.cardId);

      return true;
    } catch {
      return false;
    }
  }
}
