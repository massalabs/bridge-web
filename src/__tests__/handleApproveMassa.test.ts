import { handleApproveMASSA } from '../custom/bridge/handlers/handleApproveMassa';

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
  it('should handle approval and return true', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockResolvedValue('AkajksU1Q981h1sj');

    // const mockIncreaseAllowance = jest.fn((callback) => {
    //   return callback();
    // });

    const client = {
      smartContracts: {
        callSmartContract: mockCallSmartContract,
      },
    };

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn();
    const mockSetRedeemSteps = jest.fn();
    const mockSetAmount = jest.fn();
    const handleErrorMessage = jest.fn();

    // const parseUnits = jest.fn().mockReturnValue(1313000000000000000000n);

    const result = await handleApproveMASSA(
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

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
