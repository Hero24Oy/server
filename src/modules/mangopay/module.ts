import { Module } from '@nestjs/common';

import * as services from './services';

const serviceInstances = Object.values(services);

@Module({
  imports: [],
  providers: [...serviceInstances],
  exports: [...serviceInstances],
})
export class MangopayModule {}
