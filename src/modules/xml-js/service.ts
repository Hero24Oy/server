import { Injectable } from '@nestjs/common';
import converter from 'xml-js';
import { Parser } from 'xml2js';

import { Elements } from './types';

@Injectable()
export class XmlJsService {
  private readonly parser: Parser;

  private readonly converter: typeof converter;

  constructor() {
    this.parser = new Parser();
    this.converter = converter;
  }

  async createObjectFromXml<Type>(xml: string): Promise<Type> {
    return this.parser.parseStringPromise(xml) as Promise<Type>;
  }

  createXmlFromObject<Type extends Elements>(object: Type): string {
    return this.converter.js2xml(object);
  }
}
