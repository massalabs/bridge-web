import { maskAddress } from '../../src/utils/massaFormat';

describe('Unit Mask Address test', () => {
  it('should mask the middle of an address with a specified character', () => {
    const address = 'AU1234AJAIJAI56AZJA789CIZAPKE0';
    const maskedAddress = maskAddress(address);
    expect(maskedAddress).toBe('AU12...PKE0');
  });
});
