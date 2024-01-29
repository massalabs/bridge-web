import {
  MintArgs,
  handleMintBridge,
} from '../../src/custom/bridge/handlers/handleMintBridge';
import { Status } from '../../src/store/globalStatusesStore';
import { globalStatusesStoreStateMock } from '../__ mocks __/globalStatusesStore';
import { smartContractsMock } from '../__ mocks __/mocks';

describe('handleMintBridge', () => {
  let mintArgs: MintArgs;

  beforeEach(() => {
    const lockTxID = 'mockLockTxId';

    mintArgs = {
      massaOperationID: lockTxID,
      globalStatusesStore: globalStatusesStoreStateMock,
    };
  });

  const successEvents = [
    {
      context: {
        slot: {
          period: 669983,
          thread: 29,
        },
        block: 'BvD',
        read_only: false,
        call_stack: ['AUd6uaiR', 'ASkA'],
        index_in_slot: 1,
        origin_operation_id: 'YnYa',
        is_final: true,
        is_error: false,
      },
      data: JSON.stringify({
        eventName: 'TOKEN_MINTED',
        evmRecipient: 'm9',
        massaToken: 'AS12mytBMNz',
        chainId: '11155111',
        txId: 'mockLockTxId',
        evmToken: '985291424',
      }),
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of mint event', async () => {
    smartContractsMock.getFilteredScOutputEvents.mockResolvedValueOnce(
      successEvents,
    );

    const result = await handleMintBridge(mintArgs);

    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      2,
      Status.Success,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Success,
    );
    expect(result).toBeTruthy();
  });

  test('should show error screen if no events were found on Smart Contract during mint', async () => {
    smartContractsMock.getFilteredScOutputEvents.mockRejectedValueOnce([]);

    const result = await handleMintBridge(mintArgs);

    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setError).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );

    expect(result).toBeFalsy();
  });

  test('should show error if there is a problem during mint', async () => {
    smartContractsMock.getFilteredScOutputEvents.mockRejectedValueOnce([]);

    const result = await handleMintBridge(mintArgs);

    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      2,
      Status.Error,
    );
    expect(globalStatusesStoreStateMock.setError).toHaveBeenNthCalledWith(
      1,
      Status.Error,
    );

    expect(result).toBeFalsy();
  });

  test('should show timeout screen if the mint is loo long', async () => {
    smartContractsMock.getFilteredScOutputEvents.mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Error('timeout', { cause: { error: 'timeout' } }),
    );

    const result = await handleMintBridge(mintArgs);

    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      1,
      Status.Loading,
    );
    expect(globalStatusesStoreStateMock.setMint).toHaveBeenNthCalledWith(
      2,
      Status.Warning,
    );
    expect(globalStatusesStoreStateMock.setBox).toHaveBeenNthCalledWith(
      1,
      Status.Warning,
    );

    expect(result).toBeFalsy();
  });
});
