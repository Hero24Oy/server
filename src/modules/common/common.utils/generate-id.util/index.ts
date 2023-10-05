import { BASE, RANDOM_RADIUS, SLICE_START } from './constants';

function idFragment(): string {
  return Math.floor((1 + Math.random()) * RANDOM_RADIUS)
    .toString(BASE)
    .substring(SLICE_START);
}

export function generateId(): string {
  return `${idFragment()}${idFragment()}-${idFragment()}-${idFragment()}-${idFragment()}-${idFragment()}${idFragment()}${idFragment()}`;
}
