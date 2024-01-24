import { EOperationStatus } from '@massalabs/massa-web3';
import {
  BurnRedeemParams,
  handleBurnRedeem,
} from '../../src/custom/bridge/handlers/handleBurnRedeem';
import { smartContractsMock } from '../__ mocks __/mocks';

describe('handleBurnRedeem', () => {
  let burnArgs: BurnRedeemParams;
  let mockSetLoading: jest.Mock;
  let mockSetRedeemSteps: jest.Mock;

  beforeEach(() => {
    const amount = '1313';

    mockSetLoading = jest.fn().mockImplementation();
    mockSetRedeemSteps = jest.fn().mockImplementation();

    const recipient = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    burnArgs = {
      recipient,
      amount,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of burn (speculative success) event', async () => {
    smartContractsMock.getOperationStatus.mockResolvedValueOnce(
      EOperationStatus.SPECULATIVE_SUCCESS,
    );
    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

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
    smartContractsMock.getOperationStatus.mockResolvedValueOnce(
      EOperationStatus.FINAL_ERROR,
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of operation has status of speculative_error', async () => {
    smartContractsMock.getOperationStatus.mockRejectedValueOnce(
      new Error('getOperationStatus error'),
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of timeout', async () => {
    smartContractsMock.getOperationStatus.mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Error('timeout', { cause: { error: 'timeout' } }),
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because user rejected burn', async () => {
    smartContractsMock.callSmartContract.mockRejectedValueOnce(
      new Error('TransactionExecutionError: User rejected the request'),
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });
});
