import { Module } from '@nestjs/common';

import { XmlJsService } from './service';

@Module({
  providers: [XmlJsService],
  exports: [XmlJsService],
})
export class XmlJsModule {}
