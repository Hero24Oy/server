import { Countries } from './countries';

interface Attributes {
  type: string;
}

interface Country {
  _attributes: Attributes;
  _text: Countries;
}

interface VendorBaseInformation {
  city: string;
  code: string;
  country: Country;
  name: string;
  organizationid: string;
  postcode: string;
}

interface VendorContactDetails {
  contactpersonemail: string;
  contactpersonname: string;
  contactpersonphonenumber: string;
  email: string;
  phonenumber: string;
}

interface Vendor {
  vendorbaseinformation: VendorBaseInformation;
  vendorcontactdetails: VendorContactDetails;
}

interface Root {
  vendor: Vendor;
}

export interface SellerXmlObject {
  root: Root;
}
