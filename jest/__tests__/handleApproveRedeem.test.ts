import { handleApproveRedeem } from '../../src/custom/bridge/handlers/handleApproveRedeem';
import { Client } from '../__ mocks __/mocks';

const token = {
  name: 'Massa',
  allowance: 1311000000000000000000n,
  decimals: 2,
  symbol: 'MAS',
  massaToken: 'MAST',
  evmToken: 'EVMT',
  chainId: 1091029012,
  balance: 1000n,
};

describe('handleApproveRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should increaseAllowance and approve redeem', async () => {
    const client = new Client();
    const smartContracts = client.smartContracts();
    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const handleErrorMessage = jest.fn();

    const result = await handleApproveRedeem(
      client as any,
      mockSetLoading,
      {} as any,
      {} as any,
      token,
      amount,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('should show success of redeem approval', async () => {
    const client = new Client();
    const smartContracts = client.smartContracts();

    const amount = '13';
    const decimals = 18;
    const mockSetLoading = jest.fn().mockImplementation();
    const handleErrorMessage = jest.fn().mockImplementation();
    const result = await handleApproveRedeem(
      client as any,
      mockSetLoading,
      {} as any,
      {} as any,
      token,
      amount,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContracts.callSmartContract).not.toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('should show error if there is a problem during approval', async () => {
    const client = new Client();

    const mockCallSmartContract = jest
      .fn()
      .mockRejectedValueOnce(() => new Error('error'));

    client.setMockCallSmartContract(mockCallSmartContract);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();
    const mockSetAmount = jest.fn().mockImplementation();

    const result = await handleApproveRedeem(
      client as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
      token,
      amount,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
      error: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should close loading box and show error if http req was aborted ', async () => {
    const client = new Client();

    const mockCallSmartContract = jest
      .fn()
      .mockRejectedValueOnce(
        () =>
          new Error(
            'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
          ),
      );

    client.setMockCallSmartContract(mockCallSmartContract);
    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();
    const mockSetAmount = jest.fn().mockImplementation();

    const result = await handleApproveRedeem(
      client as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
      token,
      amount,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show warning screen if user rejects the request', async () => {
    const client = new Client();

    const mockCallSmartContract = jest
      .fn()
      .mockRejectedValueOnce(
        () => new Error('TransactionExecutionError: User rejected the request'),
      );

    client.setMockCallSmartContract(mockCallSmartContract);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();
    const mockSetAmount = jest.fn().mockImplementation();

    const result = await handleApproveRedeem(
      client as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
      token,
      amount,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { approve: 'loading' });

    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      approve: 'none',
      box: 'none',
      burn: 'none',
      error: 'none',
      lock: 'none',
      mint: 'none',
      redeem: 'none',
    });
    expect(mockSetAmount).toHaveBeenCalledWith('');
    expect(result).toBeFalsy();
  });
});
