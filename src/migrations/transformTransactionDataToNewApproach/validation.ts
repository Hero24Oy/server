import {
  PaymentSystem,
  PaymentTransaction,
  PaymentTransactionStatus,
  PaymentTransactionSubjectType,
  PaymentTransactionType,
} from 'hero24-types';
import * as yup from 'yup';

export const newTransactionSchema = yup.object<PaymentTransaction>({
  status: yup
    .string<PaymentTransactionStatus>()
    .oneOf(Object.values(PaymentTransactionStatus))
    .required(),
  type: yup
    .string<PaymentTransactionType>()
    .oneOf(Object.values(PaymentTransactionType))
    .required(),
  service: yup
    .string<PaymentSystem>()
    .oneOf(Object.values(PaymentSystem))
    .required(),
  externalServiceId: yup.mixed().nullable().required(),
  subjectType: yup
    .string<PaymentTransactionSubjectType>()
    .oneOf(Object.values(PaymentTransactionSubjectType))
    .required(),
  subjectId: yup.string().required(),
  amount: yup.number().required(),
  promotionId: yup.string().optional(),
  paidAt: yup.number().optional(),
  createdAt: yup.number().optional(),
});
