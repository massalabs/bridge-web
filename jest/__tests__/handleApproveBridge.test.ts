import { handleApproveBridge } from '../../src/custom/bridge/handlers/handleApproveBridge';
import { Utils } from '../__ mocks __/mocks';

describe('handleApproveBridge', () => {
  afterEach(() => {
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
    const utils = new Utils();
    const approve = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      mockSetLoading,
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
    const utils = new Utils();

    const mockWriteAsync = jest.fn().mockRejectedValueOnce(new Error('error'));

    utils.setWriteAsync(mockWriteAsync);
    const approve = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;
    const mockSetLoading = jest.fn().mockImplementation();

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      mockSetLoading,
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
    });

    expect(result).toBeFalsy();
  });
});
