import { BASE, RANDOM_RADIUS, SLICE_START } from './constants';

type GenerateIdArgs = {
  fragmentsAmount: number;
};

function generateIdPart(): string {
  return Math.floor((1 + Math.random()) * RANDOM_RADIUS)
    .toString(BASE)
    .substring(SLICE_START);
}

export function generateId(args: GenerateIdArgs): string {
  const id = '';
  const { fragmentsAmount } = args;

  for (let i = 0; i < fragmentsAmount - 1; i++) {
    id.concat(`${generateIdPart()}-`);
  }

  return id.concat(`${generateIdPart()}`);
}
