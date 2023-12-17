import { checkRedeemStatus } from '../../src/custom/bridge/handlers/checkRedeemStatus';

describe('handleFinalRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of redeem event', async () => {
    const mockEvmOpIdRef: any = {
      current: '0x1234567890123456789012345678901234567890',
    };

    const mockEvents: any = [
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
    const mockClearRedeem = jest.fn().mockImplementation();

    const redeemArgs = {
      events: mockEvents,
      EVMOperationID: mockEvmOpIdRef,
      setLoading: mockSetLoading,
      getTokens: mockGetTokens,
      clearRedeem: mockClearRedeem,
    };

    const result = checkRedeemStatus(redeemArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      box: 'success',
      redeem: 'success',
    });
    expect(mockGetTokens).toHaveBeenCalled();
    expect(mockEvmOpIdRef.current).toBe(undefined);
    expect(mockClearRedeem).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('fail redeem event if no events', async () => {
    const mockEvmOpIdRef: any = {
      current: '0x1234567890123456789012345678901234567890',
    };
    const mockEvents: any = [{}];

    const mockSetLoading = jest.fn().mockImplementation();
    const mockGetTokens = jest.fn().mockImplementation();
    const mockClearRedeem = jest.fn().mockImplementation();

    const redeemArgs = {
      events: mockEvents,
      EVMOperationID: mockEvmOpIdRef,
      setLoading: mockSetLoading,
      getTokens: mockGetTokens,
      clearRedeem: mockClearRedeem,
    };

    const result = checkRedeemStatus(redeemArgs);
    expect(mockSetLoading).not.toHaveBeenCalledWith();
    expect(mockEvmOpIdRef.current).toBe(mockEvmOpIdRef.current);
    expect(mockClearRedeem).not.toHaveBeenCalled();

    expect(result).toBeFalsy();
  });
});
