import { Injectable } from '@nestjs/common';
import xmlEscape from 'xml-escape';
import converter, { Options } from 'xml-js';
import { Parser } from 'xml2js';

import { Entity } from './types';

@Injectable()
export class XmlJsService {
  private readonly parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async createObjectFromXml<Type>(xml: string): Promise<Type> {
    return this.parser.parseStringPromise(xml) as Promise<Type>;
  }

  createXmlFromObject<Type extends Entity>(
    object: Type,
    options: Options.JS2XML,
  ): string {
    const xmlEscapedObject = this.performXmlEscape<Type>(object);

    return converter.js2xml(xmlEscapedObject, options);
  }

  performXmlEscape<Type extends Entity>(object: Type): Type {
    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => {
        if (value && typeof value === 'object') {
          return [key, this.performXmlEscape(value)];
        }

        return [key, xmlEscape(String(value))];
      }),
    ) as Type;
  }
}
