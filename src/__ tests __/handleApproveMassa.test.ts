import { handleApproveMASSA } from '../custom/bridge/handlers/handleApproveMassa';

describe('handleApproveMASSA', () => {
  it('should handle approval and return true', async () => {
    const client = jest.fn().mockImplementation(() => ({
      smartContracts: jest.fn().mockImplementation(() => ({
        callSmartContract: jest.fn().mockImplementation(() => 'opId'),
      })),
    }));

    const mockSetLoading = jest.fn();
    const mockSetRedeemSteps = jest.fn();
    const mockSetAmount = jest.fn();
    const token = {
      name: 'Massa',
      allowance: 1000n,
      decimals: 2,
      symbol: 'MAS',
      massaToken: 'MAST',
      evmToken: 'EVMT',
      chainId: 1091029012,
      balance: 1000n,
    };
    const amount = '5';
    const decimals = 18;

    // (increaseAllowance as jest.Mock).mockResolvedValue();

    const result = await handleApproveMASSA(
      client as any,
      mockSetLoading,
      mockSetRedeemSteps,
      mockSetAmount,
      token,
      amount,
      decimals,
    );

    expect(mockSetLoading).toHaveBeenCalledWith({
      approve: 'loading',
    });

    // expect(increaseAllowance).toHaveBeenCalledWith(
    //   mockClient,
    //   mockToken.massaToken,
    //   expect.anything(),
    // );

    expect(mockSetLoading).toHaveBeenCalledWith({
      approve: 'success',
    });

    expect(result).toBe(true);
  });
});
