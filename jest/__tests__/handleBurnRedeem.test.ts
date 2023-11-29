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
    const client = new Client();

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.SPECULATIVE_SUCCESS);

    client.setMockGetOperationStatus(mockGetOperationStatus);
    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();
    const mockSetAmount = jest.fn().mockImplementation();

    const mockEvmAddress = '0x1234567890123456789012345678901234567890';
    const mockEvmOpIdRef = {
      current: '0x1234567890123456789012345678901234567890',
    };

    const result = await handleBurnRedeem(
      client as any,
      token,
      mockEvmAddress,
      amount,
      decimals,
      mockEvmOpIdRef as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
    );

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
      redeem: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(3, 'Burn (final)');

    expect(result).toBeTruthy();
  });

  test('should show error because of operation has status of final_error', async () => {
    const client = new Client();

    const mockGetOperationStatus = jest
      .fn()
      .mockRejectedValueOnce(EOperationStatus.FINAL_ERROR);

    client.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();
    const mockSetAmount = jest.fn().mockImplementation();

    const mockEvmAddress = '0x1234567890123456789012345678901234567890';
    const mockEvmOpIdRef = {
      current: '0x1234567890123456789012345678901234567890',
    };

    const result = await handleBurnRedeem(
      client as any,
      token,
      mockEvmAddress,
      amount,
      decimals,
      mockEvmOpIdRef as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
    );

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
      redeem: 'error',
      error: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of operation has status of speculative_error', async () => {
    const client = new Client();

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.SPECULATIVE_ERROR);

    client.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = client.smartContracts();

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    const mockSetRedeemSteps = jest.fn().mockImplementation();
    const mockSetAmount = jest.fn().mockImplementation();

    const mockEvmAddress = '0x1234567890123456789012345678901234567890';
    const mockEvmOpIdRef = {
      current: '0x1234567890123456789012345678901234567890',
    };

    const result = await handleBurnRedeem(
      client as any,
      token,
      mockEvmAddress,
      amount,
      decimals,
      mockEvmOpIdRef as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
    );

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
      redeem: 'error',
      error: 'error',
    });
    expect(result).toBeFalsy();
  });
});
