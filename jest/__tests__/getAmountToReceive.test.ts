import { parseUnits } from 'viem';
import { getAmountToReceive, serviceFeeToPercent } from '../../src/utils/utils';

describe('should calculate service fees', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 0.004 - a 0.1% service fee', () => {
    const amount = '0.004';
    const serviceFee = 10n;
    const decimals = 6;
    const result = getAmountToReceive(amount, serviceFee, decimals);
    expect(result).toBe('3996');
  });

  test('should return input amount when service fee is 0n', () => {
    const amount = '100';
    const serviceFee = 0n;
    const decimals = 6;
    const result = getAmountToReceive(amount, serviceFee, decimals);
    expect(result).toBe(amount);
  });

  test('should return 100 - 0.1% of service fees', () => {
    const amount = '100';
    const serviceFee = 10n;
    const decimals = 6;
    const result = getAmountToReceive(amount, serviceFee, decimals);
    expect(result).toBe('99900000');
  });

  test('should return 5618.897000 - 0.02% of service fee', () => {
    const amount = '5618.897000';
    const serviceFee = 20n;
    const decimals = 6;
    const result = getAmountToReceive(amount, serviceFee, decimals);
    expect(result).toBe('5607659206');
  });

  test('should return  101299120121.128893 - 0.02% of service fees', () => {
    const amount = '101299120121.128893';
    const serviceFee = 20n;
    const decimals = 6;
    const result = getAmountToReceive(amount, serviceFee, decimals);
    expect(result).toBe('101096521880886636');
  });

  test('should calculate 0.02% of MAX SAFE INT', () => {
    const amount = Number.MAX_SAFE_INTEGER.toString();
    const serviceFee = 20n;
    const decimals = 18;
    const result = getAmountToReceive(amount, serviceFee, decimals);

    const _amount = parseUnits(amount, decimals);
    const redeemFee = (_amount * serviceFee) / 10000n;
    const expectedReceivedAmount = _amount - redeemFee;

    expect(result).toBe(expectedReceivedAmount.toString());
  });

  describe('serviceFeeToPercent', () => {
    expect(serviceFeeToPercent(0n)).toBe('0%');
    expect(serviceFeeToPercent(10n)).toBe('0.1%');
    expect(serviceFeeToPercent(44n)).toBe('0.44%');
    expect(serviceFeeToPercent(500n)).toBe('5%');
    expect(serviceFeeToPercent(10000n)).toBe('100%');
  });
});
