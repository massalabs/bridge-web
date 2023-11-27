import { EOperationStatus } from '@massalabs/massa-web3';

import { handleBurnRedeem } from '../../src/custom/bridge/handlers/handleBurnRedeem';

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
  beforeAll(() => {
    jest.clearAllMocks();
  });
  test('should handle redeem burn event', async () => {
    const mockCallSmartContract = jest.fn().mockResolvedValueOnce('testhash');

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.SPECULATIVE_SUCCESS);

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
    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).toHaveBeenCalled();
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

  test('should fail because of operation final error', async () => {
    const mockCallSmartContract = jest.fn().mockResolvedValueOnce('testhash');

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_ERROR);

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
    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
      error: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should fail because of operation speculative error', async () => {
    const mockCallSmartContract = jest.fn().mockResolvedValueOnce('testhash');

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.SPECULATIVE_ERROR);

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
    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
      redeem: 'error',
      error: 'error',
    });
    expect(result).toBeFalsy();
  });
});
