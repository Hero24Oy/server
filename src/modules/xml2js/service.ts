import { Injectable } from '@nestjs/common';
import { Parser } from 'xml2js';

@Injectable()
export class Xml2JsService {
  private readonly parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async createObjectFromXml<Type>(xml: string): Promise<Type> {
    return this.parser.parseStringPromise(xml) as Promise<Type>;
  }
}
