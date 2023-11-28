import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  CardObject,
  CardRegistrationInput,
  CardRegistrationOutput,
  CardsInput,
  CardsOutput,
  DeactivateCardInput,
  UpdateCardRegistrationInput,
} from '../graphql';
import { MangopayCardService } from '../services/card';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayCardResolver {
  constructor(private readonly cardService: MangopayCardService) {}

  @Mutation(() => CardRegistrationOutput)
  async cardRegistration(
    @Args('input') input: CardRegistrationInput,
  ): Promise<CardRegistrationOutput> {
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
        RegistrationData: input.token,
      });

      return true;
    } catch {
      return false;
    }
  }

  @Query(() => CardsOutput)
  async cards(@Args('input') input: CardsInput): Promise<CardsOutput> {
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
