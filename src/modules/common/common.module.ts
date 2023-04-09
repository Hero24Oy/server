import { Module } from '@nestjs/common';
import { DateScalar } from './common.date.scalar';

@Module({
  providers: [DateScalar],
})
export class CommonModule {}
