import { Injectable } from '@nestjs/common';
import {
  card as MangopayCard,
  cardRegistration as MangopayCardRegistration,
} from 'mangopay2-nodejs-sdk';

import { MangopayCurrency } from '../enums';

import { MangopayInstanceService } from './instance';

@Injectable()
export class MangopayCardService {
  constructor(private readonly api: MangopayInstanceService) {}

  async registerCard(
    data: MangopayCardRegistration.CreateCardRegistration,
  ): Promise<MangopayCardRegistration.CardRegistrationData> {
    return this.api.CardRegistrations.create({
      ...data,
      Currency: MangopayCurrency.EUR,
    });
  }

  async updateCardRegistration(
    data: MangopayCardRegistration.UpdateCardRegistration,
  ): Promise<MangopayCardRegistration.CardRegistrationData> {
    return this.api.CardRegistrations.update({
      ...data,
    });
  }

  async getCardRegistrationById(
    id: string,
  ): Promise<MangopayCardRegistration.CardRegistrationData> {
    return this.api.CardRegistrations.get(id);
  }

  async deactivateCardById(id: string): Promise<MangopayCard.CardData> {
    return this.api.Cards.update({ Id: id, Active: false });
  }

  async getCardById(id: string): Promise<MangopayCard.CardData> {
    return this.api.Cards.get(id);
  }

  async getCardsByUserId(id: string): Promise<MangopayCard.CardData[]> {
    return this.api.Users.getCards(id);
  }
}
