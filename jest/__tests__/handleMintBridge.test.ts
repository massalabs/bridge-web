import { EOperationStatus } from '@massalabs/massa-web3';

import { handleMintBridge } from '@/custom/bridge/handlers/handleMintBridge';

describe('handleMintBridge', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('should show success of mint event', async () => {
    const lockTxId = 'mockLockTransactionId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const mockGetFilteredScOutputEvent = jest.fn().mockResolvedValueOnce([
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
        data: `{"eventName": "TOKEN_MINTED","evmRecipient": "m9",
                 "massaToken": "AS12mytBMNz","chainId": "11155111","txId": 
                "${lockTxId}","evmToken": "985291424"}`,
      },
    ]);

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        getFilteredScOutputEvents: mockGetFilteredScOutputEvent,
        getOperationStatus: mockGetOperationStatus,
      }),
    };
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
    const lockTxID = 'mockLockTxId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const mockGetFilteredScOutputEvent = jest.fn().mockResolvedValueOnce([]);

    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

    const client = {
      smartContracts: () => ({
        getFilteredScOutputEvents: mockGetFilteredScOutputEvent,
        getOperationStatus: mockGetOperationStatus,
      }),
    };

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
    const lockTxID = 'mockLockTxId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const mockGetFilteredScOutputEvent = jest
      .fn()
      .mockRejectedValueOnce(new Error('error'));
    const client = {
      smartContracts: () => ({
        getFilteredScOutputEvents: mockGetFilteredScOutputEvent,
      }),
    };

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
    const lockTxID = 'mockLOckTxId';

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const mockGetFilteredScOutputEvent = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('timeout', { cause: { error: 'timeout' } }),
      );
    // We cannot mock correctly waitForMIntEvent, so we mock a timeout here

    const client = {
      smartContracts: () => ({
        getFilteredScOutputEvents: mockGetFilteredScOutputEvent,
      }),
    };

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
