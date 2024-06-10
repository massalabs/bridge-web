import { retrievePercent } from '../../src/utils/utils';

describe('retrievePercent', () => {
  test('', () => {
    expect(retrievePercent('1000', '998')).toBe('0.2%');
    expect(retrievePercent('10000', '9998')).toBe('0.02%');
    expect(retrievePercent('1', '1')).toBe('100%');
    expect(retrievePercent('10000000000', '1')).toBe('99.99%');
    // minimal value in
    expect(retrievePercent('0', '0')).toBe('0%');
    expect(retrievePercent('0', '10000000000')).toBe('0%');
    // maximal value out
    expect(retrievePercent('0', '10000000000')).toBe('0%');
    expect(retrievePercent('10000000000', '0')).toBe('100%');
  });
});
