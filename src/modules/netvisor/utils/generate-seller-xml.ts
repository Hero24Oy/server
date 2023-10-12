import xmlEscape from 'xml-escape';

import { COUNTRY_ISO } from '../constants';
import { Countries } from '../enums';
import { CreateNetvisorAccountArguments, SellerXmlObject } from '../types';

export const generateSellerXml = (
  props: CreateNetvisorAccountArguments,
): SellerXmlObject => {
  const {
    seller: { data: sellerData },
    user: { id: userId, data: userData },
  } = props;

  const phonenumber = xmlEscape(userData.phone ?? '');

  return {
    root: {
      vendor: {
        vendorbaseinformation: {
          code: userId,
          name: xmlEscape(sellerData.companyName),
          address: xmlEscape(sellerData.streetAddress),
          postcode: sellerData.postalCode,
          city: xmlEscape(sellerData.city),
          country: {
            _attributes: {
              type: COUNTRY_ISO,
            },
            _text: Countries.FINLAND,
          },
          organizationid: xmlEscape(sellerData.companyVAT),
        },
        vendorcontactdetails: {
          phonenumber,
          email: xmlEscape(sellerData.companyEmail),
          contactpersonname: xmlEscape(userData.name),
          contactpersonphonenumber: phonenumber,
          contactpersonemail: xmlEscape(userData.email),
        },
      },
    },
  };
};
