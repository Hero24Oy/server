import { cloneDeep, omit } from "lodash";
import { OfferRequestQuestionDto } from "src/modules/offer-request/offer-request-question/dto/offer-request-question/offer-request-question.dto";

export const omitDependencyIds = (questions: OfferRequestQuestionDto[]) =>
  questions.map((question) => {
    const questionClone = cloneDeep(question);

    if ('options' in questionClone) {
      questionClone.options = questionClone.options.map(
        (options) => options && omit(options, ['questions']),
      );
    }

    return omit(questionClone, ['depsId']);
  });