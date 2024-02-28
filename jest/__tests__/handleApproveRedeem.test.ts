import { EOperationStatus } from '@massalabs/massa-web3';
import { TIMEOUT, U256_MAX } from '../../src/const';
import { handleApproveRedeem } from '../../src/custom/bridge/handlers/handleApproveRedeem';
import { Status } from '../../src/store/globalStatusesStore';
import { globalStatusesStoreStateMock } from '../__ mocks __/globalStatusesStore';
import { smartContractsMock } from '../__ mocks __/mocks';

describe('handleApproveRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should increaseAllowance and approve redeem', async () => {
    const amount = U256_MAX.toString();
    const opId = 'opId';
    smartContractsMock.callSmartContract.mockResolvedValueOnce(opId);
    smartContractsMock.getOperationStatus.mockResolvedValueOnce(
      EOperationStatus.FINAL_SUCCESS,
    );

    const result = await handleApproveRedeem(amount);

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).toHaveBeenCalledWith(opId);

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      2,
      Status.Success,
    );

    expect(result).toBeTruthy();
  });

  test('should not increaseAllowance and show success of redeem approval', async () => {
    const amount = '1';

    const result = await handleApproveRedeem(amount);

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(smartContractsMock.callSmartContract).not.toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      2,
      Status.Success,
    );

    expect(result).toBeTruthy();
  });

  test('should show error if there is a problem during approval', async () => {
    smartContractsMock.callSmartContract.mockRejectedValueOnce(
      new Error('error'),
    );

    const amount = U256_MAX.toString();

    const result = await handleApproveRedeem(amount);

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );

    expect(result).toBeFalsy();
  });

  test('should error if user rejected approval', async () => {
    smartContractsMock.callSmartContract = jest
      .fn()
      .mockRejectedValueOnce(
        () =>
          new Error(
            'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
          ),
      );

    const amount = U256_MAX.toString();

    const result = await handleApproveRedeem(amount);

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );
    expect(result).toBeFalsy();
  });

  test('should show error is approval timeout', async () => {
    smartContractsMock.callSmartContract = jest
      .fn()
      .mockRejectedValueOnce(new Error(TIMEOUT));

    const amount = U256_MAX.toString();

    const result = await handleApproveRedeem(amount);

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(smartContractsMock.callSmartContract).toHaveBeenCalled();
    expect(smartContractsMock.getOperationStatus).not.toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
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
