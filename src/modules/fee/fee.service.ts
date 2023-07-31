import { Injectable } from '@nestjs/common';
import { FeeDB } from 'hero24-types';

import { FirebaseService } from '../firebase/firebase.service';
import { FirebaseDatabasePath } from '../firebase/firebase.constants';
import { FeeDto } from './dto/fee/fee.dto';
import { FeeListArgs } from './dto/fee-list/fee-list.args';
import { Identity } from '../auth/auth.types';
import { FeeListDto } from './dto/fee-list/fee-list.dto';
import { paginate, preparePaginatedResult } from '../common/common.utils';
import { FeeCreationArgs } from './dto/creation/fee-creation.args';
import { FeeCreationInput } from './dto/creation/fee-creation.input';
import { OfferRequestService } from '../offer-request/offer-request.service';
import { FeeEditingArgs } from './dto/editing/fee-editing.args';
import { FeeDataDto } from './dto/fee/fee-data.dto';

@Injectable()
export class FeeService {
  constructor(
    private firebaseService: FirebaseService,
    private offerRequestService: OfferRequestService,
  ) {}

  async getFeeById(id: string): Promise<FeeDto | null> {
    const database = this.firebaseService.getDefaultApp().database();

    const feeSnapshot = await database
      .ref(FirebaseDatabasePath.FEES)
      .child(id)
      .get();

    const fee: FeeDB | null = feeSnapshot.val();

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
    const database = this.firebaseService.getDefaultApp().database();

    const feesSnapshot = await database.ref(FirebaseDatabasePath.FEES).get();

    const fees: Record<string, FeeDB> | null = feesSnapshot.val();

    return Object.entries(fees || {}).map(([id, fee]) =>
      FeeDto.adapter.toExternal({ ...fee, id }),
    );
  }

  async getFeeList(args: FeeListArgs, identity: Identity): Promise<FeeListDto> {
    const { offset, limit } = args;

    let nodes = await this.getAllFees();

    if (!identity.isAdmin) {
      nodes = nodes.filter((fee) => fee.userId === identity.id);
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

    const database = this.firebaseService.getDefaultApp().database();

    const feeRef = await database.ref(FirebaseDatabasePath.FEES).push(fee);

    if (!feeRef.key) {
      throw new Error("Fee wasn't created");
    }

    return this.strictGetFeeById(feeRef.key);
  }

  async editFee(args: FeeEditingArgs): Promise<FeeDto> {
    const data: FeeDB['data'] = FeeDataDto.adapter.toInternal(args.data);

    const database = this.firebaseService.getDefaultApp().database();

    await database
      .ref(FirebaseDatabasePath.FEES)
      .child(args.id)
      .child('data')
      .update(data);

    return this.strictGetFeeById(args.id);
  }
}
