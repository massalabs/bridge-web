import { formatAmount } from '../../src/utils/parseAmount';

describe('formatAmount', () => {
  test('formats an amount with default parameters', () => {
    const result = formatAmount('123456789012345678901');
    expect(result).toEqual({
      in2decimals: '123.46',
      full: '123.456789012345678901',
    });
  });

  test('formats an amount with less than the specified decimals', () => {
    const result = formatAmount('12345', 8);
    expect(result).toEqual({
      in2decimals: '0.00',
      full: '0.00012345',
    });
  });

  test('formats an amount with custom separator', () => {
    const result = formatAmount('123456789012345678901', 9, "'");
    expect(result).toEqual({
      in2decimals: "123'456'789'012.35",
      full: "123'456'789'012.345678901",
    });
  });

  test('adds padding zeroes when necessary', () => {
    const result = formatAmount('1', 18, ',');
    expect(result).toEqual({
      in2decimals: '0.00',
      full: '0.000000000000000001',
    });
  });

  test('handles amount with exact decimals length', () => {
    const result = formatAmount('1000000000000000000', 18);
    expect(result).toEqual({
      in2decimals: '1.00',
      full: '1.000000000000000000',
    });
  });
});