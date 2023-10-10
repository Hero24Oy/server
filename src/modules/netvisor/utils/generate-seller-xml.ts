import xmlEscape from 'xml-escape';
import { js2xml } from 'xml-js';

import { COUNTRY_ISO, jsToXmlOptions } from '../constants';
import { Countries, CreateNetvisorAccountArguments } from '../types';

export const generateSellerXml = (
  props: CreateNetvisorAccountArguments,
): string => {
  const {
    seller: { data: sellerData },
    user: { id: userId, data: userData },
  } = props;

  const phonenumber = xmlEscape(userData.phone ?? '');

  const object = {
    root: {
      vendor: {
        vendorbaseinformation: {
          code: userId,
          name: xmlEscape(sellerData.companyName),
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

  return js2xml(object, jsToXmlOptions);
};
