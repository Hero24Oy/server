import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class CryptoService {
  hashWithSha256(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }
}
