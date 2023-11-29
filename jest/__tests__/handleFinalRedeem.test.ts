import { handleFinalRedeem } from '../../src/custom/bridge/handlers/handleFinalRedeem';

describe('handleBurnRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of redeem event', async () => {
    const mockEvmOpIdRef = {
      current: '0x1234567890123456789012345678901234567890',
    };

    const mockEvents = [
      {
        address: 'alice',
        args: {
          spender: '0x4a778563d5657172a12a760524b19d87a032aB68',
          token: '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0',
          burnOpId: `${mockEvmOpIdRef.current}`,
          amount: 1312000000000000000000n,
        },
        blockHash:
          '0x0018e9546f6d3356e03f25ffe82a727f9849d0a4fc01f8e42e170a0969f1a5eb',
        blockNumber: 100n,
        data: '0x00000',
        eventName: 'Redeemed',
        logIndex: 18,
        removed: false,
        topics: ['A', 'B', 'C'],
        transactionHash:
          '0x0018e9546f6d3356e03f25ffe82a727f9849d0a4fc01f8e42e170a0969f1a5eb',
        transactionIndex: 0,
      },
    ];

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();

    const result = await handleFinalRedeem(
      mockEvents as any,
      mockEvmOpIdRef as any,
      mockSetLoading,
      mockGetTokens,
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      box: 'success',
      redeem: 'success',
    });
    expect(mockGetTokens).toHaveBeenCalled();
    expect(mockEvmOpIdRef.current).toBe(undefined);
    expect(result).toBeTruthy();
  });

  test('fail redeem event if no events', async () => {
    const mockEvmOpIdRef = {
      current: '0x1234567890123456789012345678901234567890',
    };
    const mockEvents = [{}];

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();
    const result = await handleFinalRedeem(
      mockEvents as any,
      mockEvmOpIdRef as any,
      mockSetLoading,
      mockGetTokens,
    );
    expect(mockSetLoading).not.toHaveBeenCalledWith();
    expect(mockEvmOpIdRef.current).toBe(mockEvmOpIdRef.current);

    expect(result).toBeFalsy();
  });
});
