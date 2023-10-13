import { Countries } from '../enums';

export interface Attributes {
  type: string;
}

export interface Country {
  _attributes: Attributes;
  _text: Countries;
}

export interface VendorBaseInformation {
  address: string;
  city: string;
  code: string;
  country: Country;
  name: string;
  organizationid: string;
  postcode: string;
}

export interface VendorContactDetails {
  contactpersonemail: string;
  contactpersonname: string;
  contactpersonphonenumber: string;
  email: string;
  phonenumber: string;
}

export interface Vendor {
  vendorbaseinformation: VendorBaseInformation;
  vendorcontactdetails: VendorContactDetails;
}

export interface Root {
  vendor: Vendor;
}

export interface SellerXmlObject extends Record<string, unknown> {
  root: Root;
}
