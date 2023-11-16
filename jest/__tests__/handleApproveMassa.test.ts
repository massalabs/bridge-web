import { EOperationStatus } from '@massalabs/massa-web3';

import { handleApproveMASSA } from '../../src/custom/bridge/handlers/handleApproveMassa';

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

describe('handleApproveMASSA', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  test('should handle approval and return true', async () => {
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

    const setApproveState = jest.fn();
    const handleErrorMessage = jest.fn();

    const result = await handleApproveMASSA(
      client as any,
      setApproveState,
      token,
      amount,
      decimals,
    );

    expect(setApproveState).toHaveBeenCalledWith('loading');

    expect(mockCallSmartContract).toHaveBeenCalled();
    expect(mockGetOperationStatus).toHaveBeenCalled();

    expect(setApproveState).toHaveBeenCalledWith('success');

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('should not call in increase allowance function', async () => {
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
    const setApproveState = jest.fn();
    const handleErrorMessage = jest.fn();
    const result = await handleApproveMASSA(
      client as any,
      setApproveState,
      token,
      amount,
      decimals,
    );

    expect(setApproveState).toHaveBeenNthCalledWith(1, 'loading');

    expect(mockCallSmartContract).not.toHaveBeenCalled();
    expect(mockGetOperationStatus).not.toHaveBeenCalled();

    expect(setApproveState).toHaveBeenNthCalledWith(2, 'success');

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
