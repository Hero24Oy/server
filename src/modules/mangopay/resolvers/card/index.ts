import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { MangopayCardService } from '../../services/card';

import {
  CardObject,
  DeactivateCardInput,
  GetCardRegistrationInput,
  GetCardRegistrationOutput,
  GetCardsByUserIdOutput,
  GetCardsByUserInput,
  UpdateCardRegistrationInput,
} from './graphql';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayCardResolver {
  constructor(private readonly cardService: MangopayCardService) {}

  @Mutation(() => GetCardRegistrationOutput)
  async getCardRegistrationData(
    @Args('input') input: GetCardRegistrationInput,
  ): Promise<GetCardRegistrationOutput> {
    const cardRegistration = await this.cardService.createCardRegistration({
      UserId: input.userId,
    });

    return {
      cardRegistration: {
        accessKey: cardRegistration.AccessKey,
        preregistrationData: cardRegistration.PreregistrationData,
      },
    };
  }

  @Mutation(() => Boolean)
  async updateCardRegistrationData(
    @Args('input') input: UpdateCardRegistrationInput,
  ): Promise<boolean> {
    try {
      await this.cardService.updateCardRegistration({
        Id: input.cardId,
        RegistrationData: input.registrationData,
      });

      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => GetCardsByUserIdOutput)
  async getCard(
    @Args('input') input: GetCardsByUserInput,
  ): Promise<GetCardsByUserIdOutput> {
    const cards = await this.cardService.getCardsByUserId(input.userId);
    const formattedCards = cards.map<CardObject>((card) => {
      return {
        id: card.Id,
        active: card.Active,
        alias: card.Alias,
        type: card.CardType,
        expirationDate: card.ExpirationDate,
      };
    });

    return {
      cards: formattedCards,
    };
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
