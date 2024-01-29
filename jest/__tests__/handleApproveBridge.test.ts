import { handleApproveBridge } from '../../src/custom/bridge/handlers/handleApproveBridge';
import { Status } from '../../src/store/globalStatusesStore';
import { globalStatusesStoreStateMock } from '../__ mocks __/globalStatusesStore';
import { Utils } from '../__ mocks __/mocks';

describe('handleApproveBridge', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of approval', async () => {
    const amount = '1313';
    const decimals = 18;

    const _handleApproveEVM = jest.fn().mockImplementation();
    const _allowanceEVM = 1314000000000000000000n;

    const result = await handleApproveBridge(
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleApproveEVM).not.toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      2,
      Status.Success,
    );

    expect(result).toBeTruthy();
  });

  test('should show success of approval after increasing allowance ', async () => {
    const utils = new Utils();
    const approve = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleApproveEVM).toHaveBeenCalled();

    expect(result).toBeFalsy();
  });

  test('approval fails because of error during allowance increase transaction', async () => {
    const utils = new Utils();

    const mockWriteAsync = jest.fn().mockRejectedValueOnce(new Error('error'));

    utils.setWriteAsync(mockWriteAsync);
    const approve = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const _handleApproveEVM = approve.writeAsync;
    const _allowanceEVM = 1311000000000000000000n;

    const result = await handleApproveBridge(
      amount,
      decimals,
      _handleApproveEVM,
      _allowanceEVM,
    );

    expect(globalStatusesStoreStateMock.setApprove).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleApproveEVM).toHaveBeenCalled();

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
