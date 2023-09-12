import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { PUBSUB_PROVIDER } from '../graphql-pubsub/graphql-pubsub.constants';

import { FeeCreationArgs } from './dto/creation/fee-creation.args';
import { FeeEditingArgs } from './dto/editing/fee-editing.args';
import { FeeDto } from './dto/fee/fee.dto';
import { FeeListArgs } from './dto/fee-list/fee-list.args';
import { FeeListDto } from './dto/fee-list/fee-list.dto';
import { FeeListFilterInput } from './dto/fee-list/fee-list-filter.input';
import {
  FEE_CREATED_SUBSCRIPTION,
  FEE_UPDATED_SUBSCRIPTION,
} from './fee.constants';
import { FeeService } from './fee.service';
import { FeeSubscriptionFilter } from './fee.utils/fee-subscription-filter.util';

@Resolver()
export class FeeResolver {
  constructor(
    private feeService: FeeService,
    @Inject(PUBSUB_PROVIDER) private pubSub: PubSub,
  ) {}

  @Query(() => FeeDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async fee(@Args('id') feeId: string): Promise<FeeDto | null> {
    return this.feeService.getFeeById(feeId);
  }

  @Query(() => FeeListDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async feeList(
    @Args() args: FeeListArgs,
    @AuthIdentity() identity: Identity,
  ): Promise<FeeListDto> {
    return this.feeService.getFeeList(args, identity);
  }

  @Mutation(() => FeeDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async createFee(@Args() args: FeeCreationArgs): Promise<FeeDto> {
    return this.feeService.createFee(args);
  }

  @Mutation(() => FeeDto)
  @UseFilters(FirebaseExceptionFilter)
  @UseGuards(AuthGuard)
  async editFee(@Args() args: FeeEditingArgs): Promise<FeeDto> {
    return this.feeService.editFee(args);
  }

  @Subscription(() => FeeDto, {
    name: FEE_UPDATED_SUBSCRIPTION,
    filter: FeeSubscriptionFilter(FEE_UPDATED_SUBSCRIPTION),
  })
  @UseGuards(AuthGuard)
  subscribeOnFeeUpdate(
    @Args('filter') _filter: FeeListFilterInput, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    return this.pubSub.asyncIterator(FEE_UPDATED_SUBSCRIPTION);
  }

  @Subscription(() => FeeDto, {
    name: FEE_CREATED_SUBSCRIPTION,
    filter: FeeSubscriptionFilter(FEE_CREATED_SUBSCRIPTION),
  })
  @UseGuards(AuthGuard)
  subscribeOnFeeCreate(
    @Args('filter') _filter: FeeListFilterInput, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    return this.pubSub.asyncIterator(FEE_CREATED_SUBSCRIPTION);
  }
}
