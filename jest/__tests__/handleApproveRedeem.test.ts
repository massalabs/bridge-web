import { EOperationStatus } from '@massalabs/massa-web3';

import { handleApproveRedeem } from '../../src/custom/bridge/handlers/handleApproveRedeem';

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
  beforeAll(() => {
    jest.clearAllMocks();
  });
  test('should increaseAllowance and approve redeem', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockResolvedValueOnce('AkajksU1Q981h1sj');

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        callSmartContract: mockCallSmartContract,
        getOperationStatus: mockGetOperationStatus,
      }),
    };

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

    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('should show success of redeem approval', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockResolvedValueOnce('AkajksU1Q981h1sj');

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        callSmartContract: mockCallSmartContract,
        getOperationStatus: mockGetOperationStatus,
      }),
    };

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

    expect(mockCallSmartContract).not.toHaveBeenCalled();
    expect(mockGetOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('should show error if there is a problem during approval', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error('error')));

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        callSmartContract: mockCallSmartContract,
        getOperationStatus: mockGetOperationStatus,
      }),
    };

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

    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
      error: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should close loading box and show error if http req was aborted ', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.reject(
          new Error(
            'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
          ),
        ),
      );
    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        callSmartContract: mockCallSmartContract,
        getOperationStatus: mockGetOperationStatus,
      }),
    };

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

    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show warning screen if user rejects the request', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.reject(
          new Error('TransactionExecutionError: User rejected the request'),
        ),
      );
    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        callSmartContract: mockCallSmartContract,
        getOperationStatus: mockGetOperationStatus,
      }),
    };

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

    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).not.toHaveBeenCalled();

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
