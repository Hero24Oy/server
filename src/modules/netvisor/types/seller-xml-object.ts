import { Countries } from '../enums';

export type Attributes = {
  type: string;
};

export type Country = {
  _attributes: Attributes;
  _text: Countries;
};

export type VendorBaseInformation = {
  address: string;
  city: string;
  code: string;
  country: Country;
  name: string;
  organizationid: string;
  postcode: string;
};

export type VendorContactDetails = {
  contactpersonemail: string;
  contactpersonname: string;
  contactpersonphonenumber: string;
  email: string;
  phonenumber: string;
};

export type Vendor = {
  vendorbaseinformation: VendorBaseInformation;
  vendorcontactdetails: VendorContactDetails;
};

export type Root = {
  vendor: Vendor;
};

export type SellerXmlObject = {
  root: Root;
};
