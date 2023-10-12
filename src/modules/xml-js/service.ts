import { Injectable } from '@nestjs/common';
import converter, { Options } from 'xml-js';
import { Parser } from 'xml2js';

import { Elements } from './types';

@Injectable()
export class XmlJsService {
  private readonly parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async createObjectFromXml<Type>(xml: string): Promise<Type> {
    return this.parser.parseStringPromise(xml) as Promise<Type>;
  }

  createXmlFromObject<Type extends Elements>(
    object: Type,
    options: Options.JS2XML,
  ): string {
    return converter.js2xml(object, options);
  }
}
