import {
  ClaimArgs,
  checkBurnedOpForRedeem,
} from '../../src/custom/bridge/handlers/checkBurnedOpForRedeem';
import { Burned, opertationStates } from '../../src/utils/lambdaApi';

describe('checkBurnedOpForRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of claim event', () => {
    const mockoperationId: `0x${string}` =
      '0x1234567890123456789012345678901234567890';

    const mockApiResponse: Burned[] = [
      {
        amount: '10',
        outputTxId: '0xabc123',
        evmChainId: 1,
        recipient: '0xdef456',
        state: opertationStates.finalizing,
        error: null,
        emitter: '0xghi789',
        inputOpId: 'op123',
        signatures: [
          {
            signature: '0x12312345678901234567890',
            relayerId: 1,
          },
          {
            signature: '0x12345601234567890',
            relayerId: 0,
          },
        ],
      },
      {
        amount: '5',
        outputTxId: null,
        evmChainId: 2,
        recipient: '0xjkl012',
        state: opertationStates.processing,
        error: 'Insufficient funds',
        emitter: '0xmnopqr',
        inputOpId: mockoperationId,
        signatures: [
          {
            signature: '0x1234567890123456789012345678901234567890',
            relayerId: 1,
          },
          {
            signature: '0x1234567890123456789012345678901234567890',
            relayerId: 0,
          },
        ],
      },
    ];

    const claimArgs: ClaimArgs = {
      burnedOpList: mockApiResponse,
      operationId: mockoperationId,
    };

    const result = checkBurnedOpForRedeem(claimArgs);

    expect(result).toBeTruthy();
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      '0x1234567890123456789012345678901234567890',
      '0x1234567890123456789012345678901234567890',
    ]);
  });

  test('should fail because no collorlating op was found', () => {
    const mockoperationId: `0x${string}` =
      '0x1234567890123456789012345678901234567890';

    const mockApiResponse: Burned[] = [
      {
        amount: '10',
        outputTxId: '0xabc123',
        evmChainId: 1,
        recipient: '0xdef456',
        state: opertationStates.finalizing,
        error: null,
        emitter: '0xghi789',
        inputOpId: 'op123',
        signatures: [
          {
            signature: '0x12312345678901234567890',
            relayerId: 1,
          },
          {
            signature: '0x12345601234567890',
            relayerId: 0,
          },
        ],
      },
      {
        amount: '5',
        outputTxId: null,
        evmChainId: 2,
        recipient: '0xjkl012',
        state: opertationStates.error,
        error: 'Insufficient funds',
        emitter: '0xmnopqr',
        inputOpId: '0x1',
        signatures: [
          {
            signature: '0x1234567890123456789012345678901234567890',
            relayerId: 1,
          },
          {
            signature: '0x1234567890123456789012345678901234567890',
            relayerId: 0,
          },
        ],
      },
    ];

    const claimArgs = {
      burnedOpList: mockApiResponse,
      operationId: mockoperationId,
    };

    const result = checkBurnedOpForRedeem(claimArgs);

    // jest evaluates empty arrays as truthy so we're not assesing this case here
    expect(result).toHaveLength(0);
    expect(result).toStrictEqual([]);
  });
});
