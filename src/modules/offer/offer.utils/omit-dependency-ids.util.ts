import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import { OfferRequestQuestionDto } from '$modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question.dto';

export const omitDependencyIds = (
  questions: OfferRequestQuestionDto[],
): Omit<OfferRequestQuestionDto, 'depsId'>[] =>
  questions.map((question) => {
    const questionClone = cloneDeep(question);

    if ('options' in questionClone) {
      questionClone.options = questionClone.options.map((options) =>
        omit(options, ['questions']),
      );
    }

    return omit(questionClone, ['depsId']);
  });
