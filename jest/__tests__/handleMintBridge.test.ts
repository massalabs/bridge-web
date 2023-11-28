import { handleMintBridge } from '../../src/custom/bridge/handlers/handleMintBridge';
import { Client } from '../__ mocks __/mocks';

describe('handleMintBridge', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of mint event', async () => {
    const lockTxId = 'mockLockTxId';
    const client = new Client();

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const result = await handleMintBridge(
      client as any,
      lockTxId,
      mockSetLoading,
      mockGetTokens,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'success',
      mint: 'success',
    });
    expect(result).toBeTruthy();
  });

  test('should show error screen if no events were found on Smart Contract during mint', async () => {
    const client = new Client();
    const mockGetFilteredScOutputEvent = jest.fn().mockRejectedValueOnce([]);
    client.setMockGetFilteredScOutputEvent(mockGetFilteredScOutputEvent);

    const lockTxID = 'mockLockTxId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const result = await handleMintBridge(
      client as any,
      lockTxID,
      mockSetLoading,
      mockGetTokens,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      mint: 'error',
      error: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should show error if there is a problem during mint', async () => {
    const client = new Client();
    const mockGetFilteredScOutputEvent = jest
      .fn()
      .mockRejectedValueOnce(new Error('error'));
    client.setMockGetFilteredScOutputEvent(mockGetFilteredScOutputEvent);

    const lockTxID = 'mockLockTxId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const result = await handleMintBridge(
      client as any,
      lockTxID,
      mockSetLoading,
      mockGetTokens,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      mint: 'error',
      error: 'error',
    });

    expect(result).toBeFalsy();
  });

  test('should show timeout screen if the mint is loo long', async () => {
    const client = new Client();
    const mockGetFilteredScOutputEvent = jest.fn().mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Error('timeout', { cause: { error: 'timeout' } }),
    );

    client.setMockGetFilteredScOutputEvent(mockGetFilteredScOutputEvent);

    const lockTxID = 'mockLOckTxId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();
    // We cannot mock correctly waitForMIntEvent, so we mock a timeout here

    const result = await handleMintBridge(
      client as any,
      lockTxID,
      mockSetLoading,
      mockGetTokens,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, { mint: 'loading' });
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'warning',
      mint: 'warning',
    });

    expect(result).toBeFalsy();
  });
});
