import { roundToStep } from './round-to-step.util';

type TestItem = {
  value: number;
  step: number;
  result: {
    ceil: number;
    floor: number;
    round: number;
  };
};

const items: TestItem[] = [
  {
    value: 10.03,
    step: 0.02,
    result: {
      ceil: 10.04,
      floor: 10.02,
      round: 10.04,
    },
  },
  {
    value: 0.003,
    step: 0.002,
    result: {
      ceil: 0.004,
      floor: 0.002,
      round: 0.004,
    },
  },
  {
    value: 0.03,
    step: 0.03,
    result: {
      ceil: 0.03,
      floor: 0.03,
      round: 0.03,
    },
  },
  {
    value: 0.031,
    step: 0.03,
    result: {
      ceil: 0.06,
      floor: 0.03,
      round: 0.03,
    },
  },
  {
    value: 0.01,
    step: 0.03,
    result: {
      ceil: 0.03,
      floor: 0,
      round: 0,
    },
  },
  {
    value: 10,
    step: 90,
    result: {
      ceil: 90,
      floor: 0,
      round: 0,
    },
  },
  {
    value: 44,
    step: 90,
    result: {
      ceil: 90,
      floor: 0,
      round: 0,
    },
  },
  {
    value: 45,
    step: 90,
    result: {
      ceil: 90,
      floor: 0,
      round: 90,
    },
  },
  {
    value: 80,
    step: 90,
    result: {
      ceil: 90,
      floor: 0,
      round: 90,
    },
  },
  {
    value: 90,
    step: 90,
    result: {
      ceil: 90,
      floor: 90,
      round: 90,
    },
  },
  {
    value: 0,
    step: 90,
    result: {
      ceil: 0,
      floor: 0,
      round: 0,
    },
  },
];

describe('roundToStep', () => {
  describe('ceil', () => {
    items.forEach(({ value, step, result }) => {
      it(`should round ${value} with step ${step} to ${result.ceil}`, async () => {
        expect(roundToStep(value, step, 'ceil')).toBe(result.ceil);
      });
    });
  });

  describe('round', () => {
    items.forEach(({ value, step, result }) => {
      it(`should round ${value} with step ${step} to ${result.round}`, async () => {
        expect(roundToStep(value, step, 'round')).toBe(result.round);
      });
    });
  });

  describe('floor', () => {
    items.forEach(({ value, step, result }) => {
      it(`should round ${value} with step ${step} to ${result.floor}`, async () => {
        expect(roundToStep(value, step, 'floor')).toBe(result.floor);
      });
    });
  });
});
