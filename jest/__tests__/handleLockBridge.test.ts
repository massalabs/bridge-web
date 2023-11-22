import { handleLockBridge } from '@/custom/bridge/handlers/handleLockBridge';

describe('handleBridge', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  test('should handle bridge', async () => {
    const lock = {
      writeAsync: jest
        .fn()
        .mockResolvedValueOnce(
          'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        ),
    };

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();

    const _handleLockEVM = lock.writeAsync;

    const result = await handleLockBridge(
      mockSetLoading,
      {} as any,
      {} as any,
      amount,
      _handleLockEVM,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { lock: 'loading' });

    expect(_handleLockEVM).toHaveBeenCalled();

    expect(result).toBeTruthy();
  });

  test('should throw error', async () => {
    const lock = {
      writeAsync: jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new Error('error'))),
    };

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();

    const _handleLockEVM = lock.writeAsync;

    const result = await handleLockBridge(
      mockSetLoading,
      {} as any,
      {} as any,
      amount,
      _handleLockEVM,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { lock: 'loading' });

    expect(_handleLockEVM).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      lock: 'error',
      mint: 'error',
    });

    expect(mockSetLoading).toHaveBeenNthCalledWith(3, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
      error: 'error',
    });

    expect(result).toBeFalsy();
  });
});