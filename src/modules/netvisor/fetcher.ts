import { Injectable } from '@nestjs/common';

import { XmlJsService } from '../xml-js/service';

import {
  createNetvisorAccountParameters,
  editNetvisorAccountParameters,
  jsToXmlOptions,
  purchaseInvoiceListParameters,
} from './constants';
import {
  CreateNetvisorAccountArguments,
  CreateNetvisorAccountResponse,
  EditNetvisorAccountArguments,
  NetvisorBaseHeaders,
  NetvisorEndpoint,
  NetvisorHeaders,
  NetvisorHeadersName,
  NetvisorPurchaseInvoiceListResponse,
  SellerXmlObject,
} from './types';
import { generateSellerXml } from './utils';

import { ConfigType } from '$config';
import { Config } from '$decorator';
import { CryptoService } from '$modules/crypto/service';
import { CustomFetcher } from '$utils';

@Injectable()
export class NetvisorFetcher {
  private readonly baseHeaders: NetvisorBaseHeaders;

  private readonly baseUrl: string;

  private readonly config: ConfigType['netvisor'];

  constructor(
    @Config() config: ConfigType,
    private readonly cryptoService: CryptoService,
    private readonly xmlJsService: XmlJsService,
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

  async fetchPurchaseInvoiceList(startDate: string): Promise<string[] | void> {
    const fetcher = new CustomFetcher(
      this.baseUrl,
      NetvisorEndpoint.PURCHASE_INVOICE_LIST,
      {
        ...purchaseInvoiceListParameters,
        lastmodifiedstart: startDate,
      },
    );

    const headers = this.createFullHeaders(fetcher.getStringifiedUrl());

    try {
      const response = await fetcher.get(headers);

      const xmlString = await response.text();

      const data =
        await this.xmlJsService.createObjectFromXml<NetvisorPurchaseInvoiceListResponse>(
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

  async createNetvisorAccount(
    props: CreateNetvisorAccountArguments,
  ): Promise<string | void> {
    const xmlObject = generateSellerXml(props);

    const body = this.xmlJsService.createXmlFromObject<SellerXmlObject>(
      xmlObject,
      jsToXmlOptions,
    );

    const fetcher = new CustomFetcher(
      this.baseUrl,
      NetvisorEndpoint.VENDOR,
      createNetvisorAccountParameters,
    );

    const headers = this.createFullHeaders(fetcher.getStringifiedUrl());

    try {
      const response = await fetcher.post({ headers, body });

      const xmlString = await response.text();

      const data =
        await this.xmlJsService.createObjectFromXml<CreateNetvisorAccountResponse>(
          xmlString,
        );

      return data.Root.Replies[0].InsertedDataIdentifier[0];
    } catch (error) {
      console.error(error);
    }
  }

  async editNetvisorAccount(
    props: EditNetvisorAccountArguments,
  ): Promise<void> {
    const { netvisorKey } = props;
    const xmlObject = generateSellerXml(props);

    const body = this.xmlJsService.createXmlFromObject<SellerXmlObject>(
      xmlObject,
      jsToXmlOptions,
    );

    const fetcher = new CustomFetcher(this.baseUrl, NetvisorEndpoint.VENDOR, {
      ...editNetvisorAccountParameters,
      netvisorkey: netvisorKey,
    });

    const headers = this.createFullHeaders(fetcher.getStringifiedUrl());

    try {
      await fetcher.post({ headers, body });
    } catch (error) {
      console.error(error);
    }
  }
}
