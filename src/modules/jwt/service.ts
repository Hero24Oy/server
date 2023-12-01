import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

import { SignJwtParams, VerifyJwtParams } from './types';

@Injectable()
export class JwtService {
  sign<Data extends Record<string, unknown>>(
    params: SignJwtParams<Data>,
  ): string {
    const { data, secret, expiresIn } = params;

    return sign(data, secret, { expiresIn });
  }

  verify<Data extends Record<string, unknown>>(params: VerifyJwtParams): Data {
    const { token, secret } = params;

    return verify(token, secret) as Data;
  }
}
