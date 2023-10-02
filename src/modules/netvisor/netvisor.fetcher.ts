import { Injectable } from '@nestjs/common';

import { Xml2JsService } from '../xml2js/xml2js.service';

import { purchaseInvoiceListParameters } from './netvisor.constants';
import {
  NetvisorBaseHeaders,
  NetvisorEndpoint,
  NetvisorHeaders,
  NetvisorPurchaseInvoiceListResponse,
} from './netvisor.types';
import { NetvisorHeadersName } from './netvisor.types/headers-name.type';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { CryptoService } from '$modules/crypto/crypto.service';
import { CustomUrl } from '$utils';

@Injectable()
export class NetvisorFetcher {
  private readonly baseHeaders: NetvisorBaseHeaders;

  private readonly baseUrl: string;

  private readonly config: ConfigType['netvisor'];

  constructor(
    @Config() config: ConfigType,
    private readonly cryptoService: CryptoService,
    private readonly xml2JsService: Xml2JsService,
  ) {
    this.config = config.netvisor;

    this.baseUrl = this.config.baseUrl;
    this.baseHeaders = {
      [NetvisorHeadersName.CONTENT_TYPE]: 'text/plain',
      [NetvisorHeadersName.SENDER]: this.config.sender,
      [NetvisorHeadersName.CUSTOMER_ID]: this.config.customerId,
      [NetvisorHeadersName.PARTNER_ID]: this.config.partnerId,
      [NetvisorHeadersName.LANGUAGE]: 'FI',
      [NetvisorHeadersName.ORGANISATION_ID]: this.config.orgId,
      [NetvisorHeadersName.ALGORITHM]: 'SHA256',
    };
  }

  private createMac(
    url: string,
    timestamp: number,
    transactionId: string,
  ): string {
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

    return this.cryptoService.hashWithSha256(verifiedString);
  }

  private createFullHeaders(url: string): NetvisorHeaders {
    const timestamp = Date.now();
    const transactionId = `TRANSID${timestamp}`;

    const mac = this.createMac(url, timestamp, transactionId);

    const headers: NetvisorHeaders = {
      ...this.baseHeaders,
      [NetvisorHeadersName.TRANSACTION_ID]: transactionId,
      [NetvisorHeadersName.TIMESTAMP]: String(timestamp),
      [NetvisorHeadersName.MAC]: mac,
    };

    return headers;
  }

  async fetchPurchaseInvoiceList(
    startDate: string,
  ): Promise<string[] | undefined> {
    const url = new CustomUrl(
      this.baseUrl,
      NetvisorEndpoint.PURCHASE_INVOICE_LIST,
      {
        ...purchaseInvoiceListParameters,
        lastmodifiedstart: startDate,
      },
    );

    const headers = this.createFullHeaders(url.toString());

    try {
      const response = await fetch(url.getUrl(), {
        headers,
        method: 'GET',
      });

      const xmlString = await response.text();

      const data =
        await this.xml2JsService.createObjectFromXml<NetvisorPurchaseInvoiceListResponse>(
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
