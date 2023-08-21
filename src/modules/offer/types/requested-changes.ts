import { OfferRequestDB } from 'hero24-types';

export type RequestedChangesDB = OfferRequestDB['data']['requestedChanges'];

export type ChangedQuestionsDB =
  NonNullable<RequestedChangesDB>['changedQuestions'];

export type InitialQuestionsDb = OfferRequestDB['data']['initial']['questions'];
