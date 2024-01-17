import { IAccount } from '@massalabs/wallet-provider';

import { BridgeMode } from '../../src/const';
import {
  MintArgs,
  handleMintBridge,
} from '../../src/custom/bridge/handlers/handleMintBridge';
import { Client as MockedClient } from '../__ mocks __/mocks';

const mode = BridgeMode.testnet;

describe('handleMintBridge', () => {
  let mintArgs: MintArgs;
  let mockSetLoading: jest.Mock;
  let clientMock: any;

  beforeEach(() => {
    const lockTxID = 'mockLockTxId';
    clientMock = new MockedClient() as any;
    mockSetLoading = jest.fn().mockImplementation();
    const mockRefreshBalances = jest.fn().mockImplementation();

    mintArgs = {
      mode,
      massaClient: clientMock,
      massaOperationID: lockTxID,
      connectedAccount: {} as IAccount,
      setLoading: mockSetLoading,
      refreshBalances: mockRefreshBalances,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of mint event', async () => {
    const result = await handleMintBridge(mintArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'success',
      mint: 'success',
    });
    expect(result).toBeTruthy();
  });

  test('should show error screen if no events were found on Smart Contract during mint', async () => {
    const mockGetFilteredScOutputEvent = jest.fn().mockRejectedValueOnce([]);
    clientMock.setMockGetFilteredScOutputEvent(mockGetFilteredScOutputEvent);

    const result = await handleMintBridge(mintArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      error: 'error',
      mint: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should show error if there is a problem during mint', async () => {
    const mockGetFilteredScOutputEvent = jest
      .fn()
      .mockRejectedValueOnce(new Error('error'));
    clientMock.setMockGetFilteredScOutputEvent(mockGetFilteredScOutputEvent);

    const result = await handleMintBridge(mintArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      error: 'error',
      mint: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should show timeout screen if the mint is loo long', async () => {
    const mockGetFilteredScOutputEvent = jest.fn().mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Error('timeout', { cause: { error: 'timeout' } }),
    );

    clientMock.setMockGetFilteredScOutputEvent(mockGetFilteredScOutputEvent);

    const result = await handleMintBridge(mintArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'warning',
      mint: 'warning',
    });

    expect(result).toBeFalsy();
  });
});
