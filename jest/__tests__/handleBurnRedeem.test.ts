import { EOperationStatus } from '@massalabs/massa-web3';
import {
  BurnRedeemParams,
  handleBurnRedeem,
} from '../../src/custom/bridge/handlers/handleBurnRedeem';
import { Status } from '../../src/store/globalStatusesStore';
import { globalStatusesStoreStateMock } from '../__ mocks __/globalStatusesStore';
import { smartContractsMock } from '../__ mocks __/mocks';

describe('handleBurnRedeem', () => {
  let burnArgs: BurnRedeemParams;
  let mockSetRedeemSteps: jest.Mock;

  beforeEach(() => {
    const amount = '1313';

    mockSetRedeemSteps = jest.fn().mockImplementation();

    const recipient = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    burnArgs = {
      recipient,
      amount,
      setBurnTxID: mocksetBurnTxID,
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

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
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

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      2,
      Status.Success,
    );
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(3, 'Burn (final)');

    expect(result).toBeTruthy();
  });

  test('should show error because of operation has status of final_error', async () => {
    smartContractsMock.getOperationStatus.mockResolvedValueOnce(
      EOperationStatus.FINAL_ERROR,
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );
    expect(result).toBeFalsy();
  });

  test('should show error because of operation has status of speculative_error', async () => {
    smartContractsMock.getOperationStatus.mockRejectedValueOnce(
      new Error('getOperationStatus error'),
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );
    expect(result).toBeFalsy();
  });

  test('should show error because of timeout', async () => {
    smartContractsMock.getOperationStatus.mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Error('timeout', { cause: { error: 'timeout' } }),
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );
    expect(result).toBeFalsy();
  });

  test('should show error because user rejected burn', async () => {
    smartContractsMock.callSmartContract.mockRejectedValueOnce(
      new Error('TransactionExecutionError: User rejected the request'),
    );

    const result = await handleBurnRedeem(burnArgs);

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setBurn).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );
    expect(result).toBeFalsy();
  });
});
