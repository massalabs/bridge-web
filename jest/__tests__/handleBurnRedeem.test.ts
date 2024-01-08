import { EOperationStatus } from '@massalabs/massa-web3';

import { handleBurnRedeem } from '../../src/custom/bridge/handlers/handleBurnRedeem';
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

describe('handleBurnRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of burn (speculative success) event', async () => {
    const client: any = new Client();

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.SPECULATIVE_SUCCESS);

    client.setMockGetOperationStatus(mockGetOperationStatus);
    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();

    const mockEvmAddress: any = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    const burnArgs = {
      client,
      token,
      evmAddress: mockEvmAddress,
      amount,
      decimals,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      2,
      'Burn (included pending)',
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      burn: 'success',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(3, 'Burn (final)');

    expect(result).toBeTruthy();
  });

  test('should show error because of operation has status of final_error', async () => {
    const client: any = new Client();

    const mockGetOperationStatus = jest
      .fn()
      .mockRejectedValueOnce(EOperationStatus.FINAL_ERROR);

    client.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();

    const mockEvmAddress: any = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    const burnArgs = {
      client,
      token,
      evmAddress: mockEvmAddress,
      amount,
      decimals,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of operation has status of speculative_error', async () => {
    const client: any = new Client();

    const mockGetOperationStatus = jest
      .fn()
      .mockRejectedValueOnce(EOperationStatus.SPECULATIVE_ERROR);

    client.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();

    const mockEvmAddress: any = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    const burnArgs = {
      client,
      token,
      evmAddress: mockEvmAddress,
      amount,
      decimals,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of timeout', async () => {
    const client: any = new Client();

    const mockGetOperationStatus = jest.fn().mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Error('timeout', { cause: { error: 'timeout' } }),
    );

    client.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();

    const mockEvmAddress: any = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    const burnArgs = {
      client,
      token,
      evmAddress: mockEvmAddress,
      amount,
      decimals,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because user rejected burn', async () => {
    const client: any = new Client();

    const mockCallSmartContract = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('TransactionExecutionError: User rejected the request'),
      );

    client.setMockCallSmartContract(mockCallSmartContract);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();

    const mockEvmAddress: any = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    const burnArgs = {
      client,
      token,
      evmAddress: mockEvmAddress,
      amount,
      decimals,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });
});
