import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseFilters, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/guards/auth.guard';
import { FirebaseExceptionFilter } from '../firebase/firebase.exception.filter';
import { FeeDto } from './dto/fee/fee.dto';
import { FeeService } from './fee.service';
import { FeeListDto } from './dto/fee-list/fee-list.dto';
import { FeeListArgs } from './dto/fee-list/fee-list.args';
import { AuthIdentity } from '../auth/auth.decorator';
import { Identity } from '../auth/auth.types';
import { FeeCreationArgs } from './dto/creation/fee-creation.args';
import { FeeEditingArgs } from './dto/editing/fee-editing.args';

@Resolver()
export class FeeResolver {
  constructor(private feeService: FeeService) {}

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
}
