import {
  EvmRedeemEvent,
  checkRedeemStatus,
} from '../../src/custom/bridge/handlers/checkRedeemStatus';

describe('handleFinalRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of redeem event', async () => {
    const mockEvmOpIdRef: { current: `0x${string}` } = {
      current: '0x1234567890123456789012345678901234567890',
    };

    const mockEvents: EvmRedeemEvent[] = [
      {
        address: '0x86506deb22c0285a0d9a5a770177176343a3e3bd',
        blockHash:
          '0x97730ee5f855c50aaa4a80f5e05098dd040d9f2fd7739f5970dee9bbe27ec468',
        blockNumber: 5007104n,
        data: '0x0000000000000000000000000',
        eventName: 'Redeemed',
        logIndex: 144,
        removed: false,
        topics: [
          '0xe442438f977cf13ed122d2e3462b1afe5a74fc3ad80af33b4962d673a5bbd371',
          '0x0000000000000000000000004a778563d5657172a12a760524b19d87a032ab68',
          '0x000000000000000000000000f6e9fbff1cf908f6ebc1a274f15f5c0985291424',
        ],
        transactionHash:
          '0x091ad0082d8e4ddcecb3705be5598419e47947cbad36ec615d7409e346899e24',
        transactionIndex: 85,
        args: {
          spender: '0x4a778563d5657172a12a760524b19d87a032aB68',
          token: '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424',
          burnOpId: '0x1234567890123456789012345678901234567890',
          amount: 1000000000000000000n,
        },
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
    const mockEvmOpIdRef: { current: `0x${string}` } = {
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
