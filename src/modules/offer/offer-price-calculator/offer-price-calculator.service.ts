import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { OfferDto } from '../dto/offer/offer.dto';

import { PRECISION } from './offer-price-calculator.constants';
import { roundDuration } from './offer-price-calculator.utils';

import { Maybe } from '$modules/common/common.monads';
import { RoundedNumber } from '$modules/price-calculator/utils/price-calculator.monad';

@Injectable()
export class OfferPriceCalculatorService {
  public getWorkedDuration(offer: OfferDto): moment.Duration {
    const maybeWorkTime = new Maybe(offer.data.workTime);

    const maybeActualDuration = maybeWorkTime.run((workTime) =>
      workTime.reduce((total, { endTime, startTime }) => {
        if (endTime) {
          return total.add(moment(endTime).diff(startTime));
        }

        return total;
      }, moment.duration(0, 'milliseconds')),
    );

    return maybeActualDuration
      .run(roundDuration)
      .valOrDefault(moment.duration(0));
  }

  public getPurchasedDuration(offer: OfferDto): moment.Duration {
    const {
      purchase: { duration },
    } = offer.data.initial;

    const extensionDuration = this.getExtensionDuration(offer);

    return roundDuration(extensionDuration.add(duration, 'hours'));
  }

  public getExtensionDuration(offer: OfferDto): moment.Duration {
    const duration = (offer.data.extensions || []).reduce(
      (total, extension) => total + extension.duration,
      0,
    );

    return moment.duration(duration, 'hours');
  }

  public getTotalDuration(offer: OfferDto): moment.Duration {
    if (offer.status === 'completed') {
      return this.getWorkedDuration(offer);
    }

    return this.getPurchasedDuration(offer);
  }

  public getPricePerHour(offer: OfferDto): number {
    return offer.data.initial.purchase.pricePerHour;
  }

  public getGrossAmount(offer: OfferDto): number {
    const hoursDuration = this.getTotalDuration(offer).asHours();
    const numberPricePerHour = this.getPricePerHour(offer);

    const duration = new RoundedNumber(hoursDuration, PRECISION);
    const pricePerHour = new RoundedNumber(numberPricePerHour, PRECISION);

    return duration.multiply(pricePerHour).val();
  }
}
