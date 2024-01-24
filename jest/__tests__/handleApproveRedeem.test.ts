import { EOperationStatus } from '@massalabs/massa-web3';
import { U256_MAX } from '../../src/const';
import { handleApproveRedeem } from '../../src/custom/bridge/handlers/handleApproveRedeem';
import { smartContractsMock } from '../__ mocks __/mocks';

describe('handleApproveRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should increaseAllowance and approve redeem', async () => {
    const amount = U256_MAX.toString();
    const opId = 'opId';
    smartContractsMock.callSmartContract.mockResolvedValueOnce(opId);
    smartContractsMock.getOperationStatus.mockResolvedValueOnce(
      EOperationStatus.FINAL_SUCCESS,
    );

    const mockSetLoading = jest.fn();

    const result = await handleApproveRedeem(mockSetLoading, amount);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalledWith(opId);

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(result).toBeTruthy();
  });

  test('should not increaseAllowance and show success of redeem approval', async () => {
    const amount = '1';

    const mockSetLoading = jest.fn().mockImplementation();
    const result = await handleApproveRedeem(mockSetLoading, amount);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContractsMock.callSmartContract).not.toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(result).toBeTruthy();
  });

  test('should show error if there is a problem during approval', async () => {
    smartContractsMock.callSmartContract.mockRejectedValueOnce(
      new Error('error'),
    );

    const amount = U256_MAX.toString();

    const mockSetLoading = jest.fn().mockImplementation();

    const result = await handleApproveRedeem(mockSetLoading, amount);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      approve: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should error if user rejected approval', async () => {
    smartContractsMock.callSmartContract = jest
      .fn()
      .mockRejectedValueOnce(
        () =>
          new Error(
            'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
          ),
      );

    const amount = U256_MAX.toString();

    const mockSetLoading = jest.fn().mockImplementation();

    const result = await handleApproveRedeem(mockSetLoading, amount);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      approve: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error is approval timeout', async () => {
    smartContractsMock.callSmartContract = jest
      .fn()
      .mockRejectedValueOnce(new Error('timeout'));

    const amount = U256_MAX.toString();

    const mockSetLoading = jest.fn().mockImplementation();

    const result = await handleApproveRedeem(mockSetLoading, amount);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      approve: 'error',
      box: 'error',
    });

    expect(result).toBeFalsy();
  });
});
