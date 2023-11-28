import { handleApproveBridge } from '../../src/custom/bridge/handlers/handleApproveBridge';

describe('handleApproveBridge', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  test('should show success of approval', async () => {
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

  test('should show success of approval after increasing allowance ', async () => {
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

  test('approval fails because of error during allowance increase transaction', async () => {
    const approve = {
      writeAsync: jest.fn().mockRejectedValueOnce(() => new Error('error')),
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

  test('should show timeout screen in case of approval timeout', async () => {
    const approve = {
      writeAsync: jest.fn().mockRejectedValueOnce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Error('timeout', { cause: { error: 'timeout' } }),
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
