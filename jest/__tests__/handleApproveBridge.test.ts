import { handleApproveBridge } from '@/custom/bridge/handlers/handleApproveBridge';

describe('handleApproveBridge', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  test('should handle EVM approval and return true', async () => {
    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();

    const _handleApproveEVM = jest.fn().mockImplementation();
    const _allowanceEVM = 1314000000000000000000n;

    const result = await handleApproveBridge(
      mockSetLoading,
      {} as any,
      {} as any,
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(_handleApproveEVM).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(result).toBeTruthy();
  });

  test('should handle & call EVM approval and return true', async () => {
    const approve = {
      writeAsync: jest
        .fn()
        .mockResolvedValueOnce(
          'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        ),
    };

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      mockSetLoading,
      {} as any,
      {} as any,
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(_handleApproveEVM).toHaveBeenCalled();

    expect(result).toBeFalsy();
  });

  test('should throw error and return false', async () => {
    const approve = {
      writeAsync: jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new Error('error'))),
    };

    const amount = '1313';
    const decimals = 18;
    const mockSetLoading = jest.fn().mockImplementation();

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      mockSetLoading,
      {} as any,
      {} as any,
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(_handleApproveEVM).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      approve: 'error',
      lock: 'error',
      mint: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should throw timeout error and return false', async () => {
    const approve = {
      writeAsync: jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.reject(new Error('timeout', { cause: { error: 'timeout' } })),
        ),
    };
    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      mockSetLoading,
      {} as any,
      {} as any,
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(_handleApproveEVM).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      approve: 'error',
      lock: 'error',
      mint: 'error',
    });

    expect(mockSetLoading).toHaveBeenNthCalledWith(3, {
      box: 'warning',
      mint: 'warning',
    });

    expect(result).toBeFalsy();
  });
});
