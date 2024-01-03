import { checkBurnedOpForRedeem } from '../../src/custom/bridge/handlers/checkBurnedOpForRedeem';
import {
  Burned,
} from '../../src/pages/Index/Layouts/LoadingLayout/RedeemLayout/InterfaceApi';

describe('handleFinalRedeem', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of claim event', async () => {

    const mockoperationId: `0x${string}` =
      '0x1234567890123456789012345678901234567890';

   const mockApiResponse: Burned[] = [
  {
    amount: "10",
    outputTxId: "0xabc123",
    ecmChainId: 1,
    recipient: "0xdef456",
    state: "successful",
    error: null,
    emitter: "0xghi789",
    inputOpId: "op123",
     signatures: [
      {
      signature: "0x12312345678901234567890",
      relayerId: 1,
    }, 
     {
      signature: "0x12345601234567890",
      relayerId: 0,
    }
    ],
  },
  {
    amount: "5",
    outputTxId: null,
    ecmChainId: 2,
    recipient: "0xjkl012",
    state: "pending",
    error: "Insufficient funds",
    emitter: "0xmnopqr",
    inputOpId: mockoperationId,
    signatures: [
      {
      signature: "0x1234567890123456789012345678901234567890",
      relayerId: 1,
    }, 
     {
      signature: "0x1234567890123456789012345678901234567890",
      relayerId: 0,
    }
    ],
    },
  ];

    const claimArgs = {
      response: mockApiResponse,
      operationId: mockoperationId,
    };

    const result = checkBurnedOpForRedeem({ ...claimArgs });

    expect(result).toBeTruthy();
  });
});
