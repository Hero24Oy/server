import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import {
  TransactionInput,
  TransactionOutput,
  TransactionsByTaskRequestIdInput,
  TransactionsByTaskRequestIdOutput,
} from './graphql';
import { TransactionService } from './service';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionOutput)
  async transaction(
    @Args('input') input: TransactionInput,
  ): Promise<TransactionOutput> {
    const { id } = input;

    const transaction = await this.transactionService.strictGetTransactionById(
      id,
    );

    return {
      transaction,
    };
  }

  @Query(() => TransactionsByTaskRequestIdOutput)
  async transactionsByTaskRequestId(
    @Args('input') input: TransactionsByTaskRequestIdInput,
  ): Promise<TransactionsByTaskRequestIdOutput> {
    const { id } = input;

    const transactions =
      await this.transactionService.getTransactionsByTaskRequestId(id);

    return {
      transactions,
    };
  }
}
