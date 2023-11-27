import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import {
  TransactionByIdInput,
  TransactionByIdOutput,
  TransactionsByIdsOutput,
  TransactionsByTaskRequestIdInput,
} from './graphql';
import { TransactionService } from './service';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionByIdOutput)
  async transaction(
    @Args('input') input: TransactionByIdInput,
  ): Promise<TransactionByIdOutput> {
    const { id } = input;

    return {
      transaction: await this.transactionService.getStrictTransactionById(id),
    };
  }

  @Query(() => TransactionsByIdsOutput)
  async transactionsByTaskRequestId(
    @Args('input') input: TransactionsByTaskRequestIdInput,
  ): Promise<TransactionsByIdsOutput> {
    const { id } = input;

    return {
      transactions: await this.transactionService.getTransactionByTaskRequestId(
        id,
      ),
    };
  }
}
