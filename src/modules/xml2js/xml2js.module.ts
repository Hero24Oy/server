import { Module } from '@nestjs/common';

import { Xml2JsService } from './xml2js.service';

@Module({
  imports: [],
  providers: [Xml2JsService],
  exports: [Xml2JsService],
})
export class Xml2JsModule {}
