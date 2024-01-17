import { EOperationStatus } from '@massalabs/massa-web3';

import { BridgeMode } from '../../src/const';
import {
  BurnRedeemParams,
  handleBurnRedeem,
} from '../../src/custom/bridge/handlers/handleBurnRedeem';
import { Client as MockedClient } from '../__ mocks __/mocks';

const mode = BridgeMode.testnet;

const token = {
  name: 'Massa',
  allowance: 1311000000000000000000n,
  decimals: 2,
  symbol: 'MAS',
  massaToken: 'MAST',
  evmToken: 'EVMT',
  chainId: 1091029012,
  balance: 1000n,
};

describe('handleBurnRedeem', () => {
  let burnArgs: BurnRedeemParams;
  let mockSetLoading: jest.Mock;
  let mockSetRedeemSteps: jest.Mock;
  let clientMock: any;

  beforeEach(() => {
    const amount = '1313';
    const decimals = 18;

    clientMock = new MockedClient() as any;
    mockSetLoading = jest.fn().mockImplementation();
    mockSetRedeemSteps = jest.fn().mockImplementation();

    const recipient = '0x1234567890123456789012345678901234567890';
    const mocksetBurnTxID = jest.fn().mockImplementation();

    burnArgs = {
      mode,
      client: clientMock,
      token,
      recipient,
      amount,
      decimals,
      setBurnTxID: mocksetBurnTxID,
      setLoading: mockSetLoading,
      setRedeemSteps: mockSetRedeemSteps,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show success of burn (speculative success) event', async () => {
    const mockGetOperationStatus = jest
      .fn()
      .mockResolvedValueOnce(EOperationStatus.SPECULATIVE_SUCCESS);

    clientMock.setMockGetOperationStatus(mockGetOperationStatus);
    const smartContracts = clientMock.smartContracts();

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      2,
      'Burn (included pending)',
    );

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      burn: 'success',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(3, 'Burn (final)');

    expect(result).toBeTruthy();
  });

  test('should show error because of operation has status of final_error', async () => {
    const mockGetOperationStatus = jest
      .fn()
      .mockRejectedValueOnce(EOperationStatus.FINAL_ERROR);

    clientMock.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = clientMock.smartContracts();

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of operation has status of speculative_error', async () => {
    const mockGetOperationStatus = jest
      .fn()
      .mockRejectedValueOnce(EOperationStatus.SPECULATIVE_ERROR);

    clientMock.setMockGetOperationStatus(mockGetOperationStatus);

    const smartContracts = clientMock.smartContracts();

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because of timeout', async () => {
    const mockGetOperationStatus = jest.fn().mockRejectedValueOnce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Error('timeout', { cause: { error: 'timeout' } }),
    );

    clientMock.setMockGetOperationStatus(mockGetOperationStatus);
    const smartContracts = clientMock.smartContracts();

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });

  test('should show error because user rejected burn', async () => {
    const mockCallSmartContract = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('TransactionExecutionError: User rejected the request'),
      );

    clientMock.setMockCallSmartContract(mockCallSmartContract);

    const smartContracts = clientMock.smartContracts();

    const result = await handleBurnRedeem(burnArgs);

    expect(mockSetLoading).toHaveBeenNthCalledWith(1, {
      burn: 'loading',
    });
    expect(mockSetRedeemSteps).toHaveBeenNthCalledWith(
      1,
      'Burn (awaiting inclusion...)',
    );
    expect(smartContracts.callSmartContract).toHaveBeenCalled();
    expect(smartContracts.getOperationStatus).not.toHaveBeenCalled();

    expect(mockSetLoading).toHaveBeenNthCalledWith(2, {
      box: 'error',
      burn: 'error',
    });
    expect(result).toBeFalsy();
  });
});
