/* eslint-disable @typescript-eslint/naming-convention -- we need disable this rule for headers */
import * as xml2js from 'xml2js';

import { purchaseInvoiceListParameters } from './netvisor.constants';
import {
  NetvisorBaseHeaders,
  NetvisorEndpoint,
  NetvisorHeaders,
  NetvisorPurchaseInvoiceListResponse,
} from './netvisor.types';

import { ConfigType } from '$config';
import { CryptoService } from '$modules/crypto/crypto.service';
import { UrlWithSearchParams } from '$utils';

const parser = new xml2js.Parser();

export class NetvisorFetcher {
  private readonly baseHeaders: NetvisorBaseHeaders;

  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigType['netvisor'],
    private readonly cryptoService: CryptoService,
  ) {
    this.baseUrl = config.baseUrl;
    this.baseHeaders = {
      'Content-Type': 'text/plain',
      'X-Netvisor-Authentication-Sender': config.sender,
      'X-Netvisor-Authentication-CustomerId': config.customerId,
      'X-Netvisor-Authentication-PartnerId': config.partnerId,
      'X-Netvisor-Interface-Language': 'FI',
      'X-Netvisor-Organisation-Id': config.orgId,
      'X-Netvisor-Authentication-MACHashCalculationAlgorithm': 'SHA256',
    };
  }

  private createFullHeaders(url: string): NetvisorHeaders {
    const timestamp = Date.now();
    const transactionId = `TRANSID${timestamp}`;

    const verifiedString = [
      url,
      this.config.sender,
      this.config.customerId,
      timestamp,
      'FI',
      this.config.orgId,
      transactionId,
      this.config.customerKey,
      this.config.partnerKey,
    ].join('&');

    const mac = this.cryptoService.hashWithSha256(verifiedString);

    const headers: NetvisorHeaders = {
      ...this.baseHeaders,
      'X-Netvisor-Authentication-TransactionId': transactionId,
      'X-Netvisor-Authentication-Timestamp': String(timestamp),
      'X-Netvisor-Authentication-MAC': mac,
    };

    return headers;
  }

  private async createObjectFromXml<Type>(xml: string): Promise<Type> {
    return parser.parseStringPromise(xml) as Promise<Type>;
  }

  async fetchPurchaseInvoiceList(
    startDate: string,
  ): Promise<string[] | undefined> {
    const url = new UrlWithSearchParams(
      new URL(NetvisorEndpoint.PURCHASE_INVOICE_LIST, this.baseUrl),
      new URLSearchParams({
        ...purchaseInvoiceListParameters,
        lastmodifiedstart: startDate,
      }),
    );

    const headers = this.createFullHeaders(url.toString());

    try {
      const response = await fetch(url.getUrl(), {
        headers,
        method: 'GET',
      });

      const xmlString = await response.text();

      const data =
        await this.createObjectFromXml<NetvisorPurchaseInvoiceListResponse>(
          xmlString,
        );

      if (Array.isArray(data.Root.PurchaseInvoiceList)) {
        return data.Root.PurchaseInvoiceList[0].PurchaseInvoice.map(
          (invoice) => {
            return invoice.NetvisorKey[0];
          },
        );
      }

      return [];
    } catch (error) {
      console.error(error);
    }
  }
}
