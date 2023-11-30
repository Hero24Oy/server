import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import {
  CreateBusinessHeroUserInput,
  CreateIndividualHeroUserInput,
  CreateProfessionalCustomerUserInput,
  CreateSoletraderHeroUserInput,
} from '../graphql';
import { MangopayUserCreationService } from '../services';

import { AuthIdentity } from '$modules/auth/auth.decorator';
import { Identity } from '$modules/auth/auth.types';
import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayUserResolver {
  constructor(
    private readonly userCreationService: MangopayUserCreationService,
  ) {}

  @Mutation(() => Boolean)
  async createMangopayIndividualHeroAccount(
    @Args('input') input: CreateIndividualHeroUserInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.userCreationService.createMangopayHeroIndividualAccount(
      id,
      input,
    );
  }

  @Mutation(() => Boolean)
  async createMangopayBusinessHeroAccount(
    @Args('input') input: CreateBusinessHeroUserInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.userCreationService.createMangopayHeroBusinessAccount(
      id,
      input,
    );
  }

  @Mutation(() => Boolean)
  async createMangopaySoletraderHeroAccount(
    @Args('input') input: CreateSoletraderHeroUserInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.userCreationService.createMangopayHeroSoletraderAccount(
      id,
      input,
    );
  }

  @Mutation(() => Boolean)
  async createMangopayIndividualCustomerAccount(
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.userCreationService.createMangopayCustomerIndividualAccount(id);
  }

  @Mutation(() => Boolean)
  async createMangopayProfessionalCustomerAccount(
    @Args('input') input: CreateProfessionalCustomerUserInput,
    @AuthIdentity() identity: Identity,
  ): Promise<boolean> {
    const { id } = identity;

    return this.userCreationService.createMangopayCustomerProfessionalAccount(
      id,
      input,
    );
  }
}
