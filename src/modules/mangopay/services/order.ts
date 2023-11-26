import { Injectable } from '@nestjs/common';
import { PaymentTransaction } from 'hero24-types';

import { JwtTokenPayload } from '../types';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { JwtService } from '$modules/jwt';
import { TransactionService } from '$modules/transaction';

@Injectable()
export class MangopayOrderService {
  constructor(
    @Config() private readonly config: ConfigType,
    private readonly jwtService: JwtService,
    private readonly transactionService: TransactionService,
  ) {}

  generatePaymentTokenByTransactionId(transactionId: string): string {
    return this.jwtService.sign({
      data: { transactionId },
      secret: this.config.mangopay.paymentLinkSecret,
      expiresIn: this.config.mangopay.linkExpireTime,
    });
  }

  verifyPaymentToken(token: string): JwtTokenPayload {
    return this.jwtService.verify<JwtTokenPayload>({
      token,
      secret: this.config.mangopay.paymentLinkSecret,
    });
  }

  async getTransactionDataByToken(token: string): Promise<PaymentTransaction> {
    let transactionId: string;

    try {
      const payload = this.jwtService.verify<JwtTokenPayload>({
        token,
        secret: this.config.mangopay.paymentLinkSecret,
      });

      transactionId = payload.transactionId;
    } catch {
      throw new Error('Payment token expired');
    }

    const transaction = await this.transactionService.getTransactionById(
      transactionId,
    );

    if (!transaction) {
      throw new Error('Invalid token payload');
    }

    return transaction;
  }
}
