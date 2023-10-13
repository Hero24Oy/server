import { COUNTRY_ISO } from '../constants';
import { Countries } from '../enums';
import { CreateNetvisorAccountArguments, SellerXmlObject } from '../types';

import { performXmlEscape } from '$modules/common/common.utils/perform-xml-escape';

export const generateSellerXmlObject = (
  props: CreateNetvisorAccountArguments,
): SellerXmlObject => {
  const {
    seller: { data: sellerData },
    user: { id: userId, data: userData },
  } = props;

  const xmlObject = {
    root: {
      vendor: {
        vendorbaseinformation: {
          code: userId,
          name: sellerData.companyName,
          address: sellerData.streetAddress,
          postcode: sellerData.postalCode,
          city: sellerData.city,
          country: {
            _attributes: {
              type: COUNTRY_ISO,
            },
            _text: Countries.FINLAND,
          },
          organizationid: sellerData.companyVAT,
        },
        vendorcontactdetails: {
          phonenumber: userData.phone ?? '',
          email: sellerData.companyEmail,
          contactpersonname: userData.name,
          contactpersonphonenumber: userData.phone ?? '',
          contactpersonemail: userData.email,
        },
      },
    },
  };

  return performXmlEscape<SellerXmlObject>(xmlObject);
};
