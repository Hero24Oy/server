import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { PaymentTokenInput } from '../graphql';
import { MangopayPayInService } from '../services/pay-in';

import { AuthGuard } from '$modules/auth/guards/auth.guard';
import { BuyerService } from '$modules/buyer/buyer.service';
import { FirebaseExceptionFilter } from '$modules/firebase/firebase.exception.filter';
import { TransactionService } from '$modules/transaction';
import { TransactionSubjectService } from '$modules/transaction-subject/service';

@Resolver()
@UseFilters(FirebaseExceptionFilter)
@UseGuards(AuthGuard)
export class MangopayPayInResolver {
  constructor(
    private readonly payInService: MangopayPayInService,
    private readonly transactionService: TransactionService,
    private readonly transactionSubjectService: TransactionSubjectService,
    private readonly buyerService: BuyerService,
  ) {}

  @Query(() => String)
  async paymentToken(@Args('input') input: PaymentTokenInput): Promise<string> {
    const { transactionId } = input;

    return this.payInService.generatePaymentTokenByTransactionId(transactionId);
  }

  // We need to confirm mangopay flow and then get author and wallet ids
  // @Query(() => Boolean)
  // async createPayIn(
  //   @Args('input') input: CreateDirectCardPayInInput,
  // ): Promise<boolean> {
  //   const { ip, browserInfo, transactionId, cardId, returnUrl } = input;

  //   const transaction = await this.transactionService.getTransactionById(
  //     transactionId,
  //   );

  //   if (!transaction) {
  //     throw new Error('Invalid transaction id');
  //   }

  //   const { amount, subjectId, subjectType } = transaction;

  //   const customerId =
  //     await this.transactionSubjectService.getCustomerIdBySubject({
  //       subjectId,
  //       subjectType,
  //     });

  //   if (!customerId) {
  //     throw new Error('Transaction owner not found');
  //   }

  //   const customer = await this.buyerService.getBuyerById(customerId);

  //   if (!customer) {
  //     throw new Error('Transaction owner not found');
  //   }

  //   await this.payInService.createDirectCardPayIn({
  //     fee: 0,
  //     ip,
  //     browserInfo,
  //     amount,
  //     cardId,
  //     returnUrl,
  //   });

  //   return true;
  // }
}
