import { Module } from '@nestjs/common';

import { Xml2JsService } from './service';

@Module({
  providers: [Xml2JsService],
  exports: [Xml2JsService],
})
export class Xml2JsModule {}
