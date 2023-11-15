import { EOperationStatus } from '@massalabs/massa-web3';

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
    const client = {
      smartContracts: () => ({
        callSmartContract: jest.fn(),
        getOperationStatus: jest.fn(),
      }),
    };

    const mockCallSmartContract = client
      .smartContracts()
      .callSmartContract.mockResolvedValueOnce('AkajksU1Q981h1sj');
    const mockgetOperationStatus = client
      .smartContracts()
      .getOperationStatus.mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const amount = '1313';
    const decimals = 18;

    const mockSetLoading = jest.fn().mockImplementation();
    // const mockSetRedeemSteps = jest.fn();
    // const mockSetAmount = jest.fn();
    const handleErrorMessage = jest.fn();

    // const parseUnits = jest.fn().mockReturnValue(1313000000000000000000n);

    const result = await handleApproveMASSA(
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
    expect(mockgetOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, { approve: 'success' });

    expect(handleErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
