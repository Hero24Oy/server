import { Injectable } from '@nestjs/common';
import { MangoPayProfessionalHeroType, MangoPayUserType } from 'hero24-types';

import {
  CreateBusinessHeroUserInput,
  CreateIndividualHeroUserInput,
  CreateProfessionalCustomerUserInput,
  CreateSoletraderHeroUserInput,
} from '../graphql';
import { CreateBankAccountParameters } from '../types';
import {
  checkUserDoesNotHasMangopayAccount,
  createMangopayAddressObject,
  createNewBusinessDocuments,
  createNewSoletraderDocuments,
} from '../utils';

import { MangopayBankService } from './bank';
import { MangopayUserService } from './user';
import { MangopayWalletService } from './wallet';

import { BuyerService } from '$modules/buyer/buyer.service';
import { SellerService } from '$modules/seller/seller.service';
import { UserService } from '$modules/user/user.service';

@Injectable()
export class MangopayUserCreationService {
  constructor(
    private readonly mangopayUserService: MangopayUserService,
    private readonly heroService: SellerService,
    private readonly customerService: BuyerService,
    private readonly userService: UserService,
    private readonly walletService: MangopayWalletService,
    private readonly bankService: MangopayBankService,
  ) {}

  private async createBankAccount(
    parameters: CreateBankAccountParameters,
  ): Promise<boolean> {
    const { heroId, mangopayId, iban, firstName, lastName, address } =
      parameters;

    const { Id: bankId } = await this.bankService.createBankAccount(
      mangopayId,
      {
        IBAN: iban,
        OwnerAddress: createMangopayAddressObject(address),
        OwnerName: `${firstName} ${lastName}`,
      },
    );

    await this.heroService.setMangopayBankId(heroId, bankId);

    return true;
  }

  async createMangopayHeroIndividualAccount(
    heroId: string,
    input: CreateIndividualHeroUserInput,
  ): Promise<boolean> {
    const { companyRepresentativeId } = input;

    return this.heroService.setMangopayData(heroId, {
      type: MangoPayUserType.INDIVIDUAL,
      companyRepresentativeId,
    });
  }

  async createMangopayHeroBusinessAccount(
    heroId: string,
    input: CreateBusinessHeroUserInput,
  ): Promise<boolean> {
    const {
      nationality,
      countryOfResidence,
      birthday,
      companyNumber,
      headquartersAddress,
      legalRepresentativeAddress,
    } = input;

    const hero = await this.heroService.strictGetSellerById(heroId);

    checkUserDoesNotHasMangopayAccount(hero);

    const user = await this.userService.strictGetUserById(heroId);

    const { companyName, companyEmail } = hero.data;
    const { email, firstName, lastName, iban } = user.data;

    if (!firstName || !lastName) {
      throw new Error('Failed to create customer mangopay account');
    }

    const { Id: userId } =
      await this.mangopayUserService.createBusinessHeroUser({
        Name: companyName,
        Email: companyEmail,
        LegalRepresentativeEmail: email,
        LegalRepresentativeFirstName: firstName,
        LegalRepresentativeLastName: lastName,
        LegalRepresentativeAddress: createMangopayAddressObject(
          legalRepresentativeAddress,
        ),
        HeadquartersAddress: createMangopayAddressObject(headquartersAddress),
        LegalRepresentativeBirthday: birthday.getTime(),
        LegalRepresentativeNationality: nationality,
        LegalRepresentativeCountryOfResidence: countryOfResidence,
        CompanyNumber: companyNumber,
      });

    const wallet = await this.walletService.createWallet({
      Owners: [userId],
      Description: `Hero ${heroId} wallet`,
    });

    const { kycStatus, uboStatus } = createNewBusinessDocuments();

    await this.heroService.setMangopayData(heroId, {
      walletId: wallet.Id,
      id: userId,
      businessOwner: {
        birthday: birthday.getTime(),
        address: {
          city: legalRepresentativeAddress.city,
          country: legalRepresentativeAddress.country,
          postalCode: legalRepresentativeAddress.postalCode,
        },
        firstName,
        lastName,
        nationality,
      },
      type: MangoPayUserType.PROFESSIONAL,
      professionalType: MangoPayProfessionalHeroType.BUSINESS,
      kycStatus,
      uboStatus,
    });

    if (iban) {
      await this.createBankAccount({
        address: legalRepresentativeAddress,
        mangopayId: userId,
        heroId,
        firstName,
        lastName,
        iban,
      });
    }

    return true;
  }

  async createMangopayHeroSoletraderAccount(
    heroId: string,
    input: CreateSoletraderHeroUserInput,
  ): Promise<boolean> {
    const {
      nationality,
      countryOfResidence,
      birthday,
      headquartersAddress,
      legalRepresentativeAddress,
    } = input;

    const hero = await this.heroService.strictGetSellerById(heroId);

    checkUserDoesNotHasMangopayAccount(hero);

    const user = await this.userService.strictGetUserById(heroId);

    const { companyName, companyEmail } = hero.data;
    const { email, firstName, lastName, iban } = user.data;

    if (!firstName || !lastName) {
      throw new Error('Failed to create customer mangopay account');
    }

    const { Id: userId } =
      await this.mangopayUserService.createSoletraderHeroUser({
        Name: companyName,
        Email: companyEmail,
        LegalRepresentativeEmail: email,
        LegalRepresentativeFirstName: firstName,
        LegalRepresentativeLastName: lastName,
        LegalRepresentativeAddress: createMangopayAddressObject(
          legalRepresentativeAddress,
        ),
        HeadquartersAddress: createMangopayAddressObject(headquartersAddress),
        LegalRepresentativeBirthday: birthday.getTime(),
        LegalRepresentativeNationality: nationality,
        LegalRepresentativeCountryOfResidence: countryOfResidence,
      });

    const wallet = await this.walletService.createWallet({
      Owners: [userId],
      Description: `Hero ${heroId} wallet`,
    });

    const { kycStatus } = createNewSoletraderDocuments();

    await this.heroService.setMangopayData(heroId, {
      walletId: wallet.Id,
      id: userId,
      businessOwner: {
        birthday: birthday.getTime(),
        address: {
          city: legalRepresentativeAddress.city,
          country: legalRepresentativeAddress.country,
          postalCode: legalRepresentativeAddress.postalCode,
        },
        firstName,
        lastName,
        nationality,
      },
      type: MangoPayUserType.PROFESSIONAL,
      professionalType: MangoPayProfessionalHeroType.SOLETRADER,
      kycStatus,
    });

    if (iban) {
      await this.createBankAccount({
        address: legalRepresentativeAddress,
        mangopayId: userId,
        heroId,
        firstName,
        lastName,
        iban,
      });
    }

    return true;
  }

  async createMangopayCustomerIndividualAccount(
    customerId: string,
  ): Promise<boolean> {
    const customer = await this.customerService.strictGetBuyerProfileById(
      customerId,
    );

    checkUserDoesNotHasMangopayAccount(customer);

    const user = await this.userService.strictGetUserById(customerId);

    const { email, firstName, lastName } = user.data;

    if (!firstName || !lastName) {
      throw new Error('Failed to create customer mangopay account');
    }

    const { Id: userId } =
      await this.mangopayUserService.createIndividualCustomerUser({
        Email: email,
        FirstName: firstName,
        LastName: lastName,
      });

    const wallet = await this.walletService.createWallet({
      Owners: [userId],
      Description: `Customer ${customerId} wallet`,
    });

    await this.customerService.setMangopayData(customerId, {
      walletId: wallet.Id,
      id: userId,
      type: MangoPayUserType.INDIVIDUAL,
    });

    return true;
  }

  async createMangopayCustomerProfessionalAccount(
    customerId: string,
    input: CreateProfessionalCustomerUserInput,
  ): Promise<boolean> {
    const { address } = input;

    const customer = await this.customerService.strictGetBuyerProfileById(
      customerId,
    );

    checkUserDoesNotHasMangopayAccount(customer);

    const user = await this.userService.strictGetUserById(customerId);

    const { displayName } = customer.data;
    const { email, firstName, lastName } = user.data;

    if (!firstName || !lastName) {
      throw new Error('Failed to create customer mangopay account');
    }

    const { Id: userId } =
      await this.mangopayUserService.createProfessionalCustomerUser({
        Name: displayName,
        Email: email,
        LegalRepresentativeFirstName: firstName,
        LegalRepresentativeLastName: lastName,
        LegalRepresentativeAddress: createMangopayAddressObject(address),
      });

    const wallet = await this.walletService.createWallet({
      Owners: [userId],
      Description: `Customer ${customerId} wallet`,
    });

    await this.customerService.setMangopayData(customerId, {
      walletId: wallet.Id,
      id: userId,
      type: MangoPayUserType.INDIVIDUAL,
    });

    return true;
  }
}
