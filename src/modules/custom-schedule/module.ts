import { Module } from '@nestjs/common';

import { CustomScheduleService } from './service';

@Module({
  providers: [CustomScheduleService],
  exports: [CustomScheduleService],
})
export class CustomScheduleModule {}
