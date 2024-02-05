import { handleLockBridge } from '../../src/custom/bridge/handlers/handleLockBridge';
import { Status } from '../../src/store/globalStatusesStore';
import { globalStatusesStoreStateMock } from '../__ mocks __/globalStatusesStore';
import { Utils } from '../__ mocks __/mocks';

describe('handleLockBridge', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of bridge lock', async () => {
    const utils = new Utils();

    const lock = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const _handleLockEVM = lock.writeAsync;

    const lockArgs = {
      amount,
      _handleLockEVM,
      decimals,
    };

    const result = await handleLockBridge(lockArgs);

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleLockEVM).toHaveBeenCalled();

    expect(result).toBeTruthy();
  });

  test('should show error if there is a problem during lock', async () => {
    const utils = new Utils();
    const mockWriteAsync = jest
      .fn()
      .mockRejectedValueOnce(() => new Error('error'));

    utils.setWriteAsync(mockWriteAsync);

    const lock = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const _handleLockEVM = lock.writeAsync;

    const lockArgs = {
      amount,
      _handleLockEVM,
      decimals,
    };

    const result = await handleLockBridge(lockArgs);

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleLockEVM).toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );

    expect(result).toBeFalsy();
  });

  test('should show error if user rejects lock', async () => {
    const utils = new Utils();
    const mockWriteAsync = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('TransactionExecutionError: User rejected the request'),
      );

    utils.setWriteAsync(mockWriteAsync);

    const lock = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const _handleLockEVM = lock.writeAsync;

    const lockArgs = {
      amount,
      _handleLockEVM,
      decimals,
    };

    const result = await handleLockBridge(lockArgs);

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleLockEVM).toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );

    expect(result).toBeFalsy();
  });

  test('should show error if user did not enter high enough allowance', async () => {
    const utils = new Utils();
    const mockWriteAsync = jest
      .fn()
      .mockRejectedValueOnce(
        new Error(
          'ContractFunctionExecutionError: Execution reverted for an unknown reason',
        ),
      );

    utils.setWriteAsync(mockWriteAsync);

    const lock = {
      writeAsync: utils.writeAsync,
    };

    const amount = '1313';
    const decimals = 18;

    const _handleLockEVM = lock.writeAsync;

    const lockArgs = {
      amount,
      _handleLockEVM,
      decimals,
    };

    const result = await handleLockBridge(lockArgs);

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );

    expect(_handleLockEVM).toHaveBeenCalled();

    expect(globalStatusesStoreStateMock.setLock).toHaveBeenNthCalledWith(
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
