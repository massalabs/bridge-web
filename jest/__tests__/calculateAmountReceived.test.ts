import { calculateAmountReceived } from '../../src/utils/utils';

describe('calculateServiceFees', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return input amount', () => {
    const amount = '100';
    const serviceFee = 0n;
    const decimals = 6;
    const result = calculateAmountReceived(amount, serviceFee, decimals);
    expect(result).toBe(amount);
  });

  test('should return amount - a 0.1% service fee', () => {
    const amount = '100';
    const serviceFee = 10n;
    const decimals = 6;
    const result = calculateAmountReceived(amount, serviceFee, decimals);
    expect(result).toBe('99.900000');
  });

  test('should return amount - a 0.2% service fee ', () => {
    const amount = '24.02';
    const serviceFee = 20n;
    const decimals = 6;
    const result = calculateAmountReceived(amount, serviceFee, decimals);
    expect(result).toBe('23.971960');
  });

  test('should return amount with 18 decimals ', () => {
    const amount = '2575';
    const serviceFee = 20n;
    const decimals = 18;
    const result = calculateAmountReceived(amount, serviceFee, decimals);
    expect(result).toBe('2569.849999999999909051');
  });
});
