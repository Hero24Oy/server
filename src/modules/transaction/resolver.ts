import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import {
  GetTransactionByIdInput,
  GetTransactionByIdOutput,
  GetTransactionsByIdsInput,
  GetTransactionsByIdsOutput,
} from './graphql';
import { TransactionService } from './service';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => GetTransactionByIdOutput)
  async transaction(
    @Args('input') input: GetTransactionByIdInput,
  ): Promise<GetTransactionByIdOutput> {
    const { id } = input;

    return {
      transaction: await this.transactionService.getStrictTransactionById(id),
    };
  }

  @Query(() => GetTransactionsByIdsOutput)
  async transactions(
    @Args('input') input: GetTransactionsByIdsInput,
  ): Promise<GetTransactionsByIdsOutput> {
    const { ids } = input;

    return {
      transactions: await this.transactionService.getStrictTransactionsByIds(
        ids,
      ),
    };
  }
}
