import { Injectable } from '@nestjs/common';
import { FeeDB } from 'hero24-types';

import { Identity } from '../auth/auth.types';
import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseTableReference } from '../firebase/firebase.types';
import { OfferRequestService } from '../offer-request/offer-request.service';
import { SorterService } from '../sorter/sorter.service';

import { FeeCreationArgs } from './dto/creation/fee-creation.args';
import { FeeCreationInput } from './dto/creation/fee-creation.input';
import { FeeEditingArgs } from './dto/editing/fee-editing.args';
import { FeeStatusEditingInput } from './dto/editing/fee-status-editing.input';
import { FeeDto } from './dto/fee/fee.dto';
import { FeeDataDto } from './dto/fee/fee-data.dto';
import { FeeListArgs } from './dto/fee-list/fee-list.args';
import { FeeListDto } from './dto/fee-list/fee-list.dto';
import { FeeListOrderColumn } from './dto/fee-list/fee-list-order-column.enum';
import { FeeMirror } from './fee.mirror';
import { FeeListSorterContext } from './fee.types';
import { filterFees } from './fee.utils/filter-fees.util';

@Injectable()
export class FeeService {
  readonly feeTableRef: FirebaseTableReference<FeeDB>;

  constructor(
    private readonly feesSorter: SorterService<
      FeeListOrderColumn,
      FeeDto,
      FeeListSorterContext
    >,
    private readonly offerRequestService: OfferRequestService,
    private readonly feeMirror: FeeMirror,
    firebaseService: FirebaseService,
  ) {
    const database = firebaseService.getDefaultApp().database();

    this.feeTableRef = database.ref(FirebaseDatabasePath.FEES);
  }

  async getFeeById(id: string): Promise<FeeDto | null> {
    const feeSnapshot = await this.feeTableRef.child(id).get();

    const fee = feeSnapshot.val();

    return fee && FeeDto.adapter.toExternal({ ...fee, id });
  }

  async strictGetFeeById(id: string): Promise<FeeDto> {
    const fee = await this.getFeeById(id);

    if (!fee) {
      throw new Error(`Fee with id ${id} was not found`);
    }

    return fee;
  }

  async getAllFees(): Promise<FeeDto[]> {
    return this.feeMirror
      .getAll()
      .map(([id, fee]) => FeeDto.adapter.toExternal({ ...fee, id }));
  }

  async getFeeList(args: FeeListArgs, identity: Identity): Promise<FeeListDto> {
    const { offset, limit, filter, ordersBy } = args;

    let nodes = await this.getAllFees();

    nodes = filterFees({ filter, fees: nodes });

    if (ordersBy) {
      nodes = this.feesSorter.sort(nodes, ordersBy, {
        identity,
      });
    }

    const total = nodes.length;

    nodes = paginate({ nodes, offset, limit });

    return preparePaginatedResult({
      nodes,
      total,
      offset,
      limit,
    });
  }

  async createFee(args: FeeCreationArgs): Promise<FeeDto> {
    const feeInput = FeeCreationInput.adapter.toInternal(args.input);

    const userId =
      await this.offerRequestService.strictGetBuyerIdByOfferRequestId(
        feeInput.offerRequest,
      );

    const fee: FeeDB = {
      ...feeInput,
      userId,
    };

    const feeRef = await this.feeTableRef.push(fee);

    if (!feeRef.key) {
      throw new Error("Fee wasn't created");
    }

    return this.strictGetFeeById(feeRef.key);
  }

  async editFee(args: FeeEditingArgs): Promise<FeeDto> {
    const data: FeeDB['data'] = FeeDataDto.adapter.toInternal(args.data);

    await this.feeTableRef.child(args.id).child('data').update(data);

    return this.strictGetFeeById(args.id);
  }

  async editFeeStatus(args: FeeStatusEditingInput): Promise<boolean> {
    const { id, status } = args;

    await this.feeTableRef.child(id).update({ status });

    return true;
  }
}
