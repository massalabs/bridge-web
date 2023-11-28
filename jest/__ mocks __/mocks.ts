import { EOperationStatus } from '@massalabs/massa-web3';

interface SmartContracts {
  callSmartContract: () => jest.Mock<any, any, any>;
  getOperationStatus: () => jest.Mock<any, any, any>;
  getFilteredScOutputEvents: () => jest.Mock<any, any, any>;
}

export class Client {
  mockCallSmartContract: () => jest.Mock<any, any, any>;
  mockGetOperationStatus: () => jest.Mock<any, any, any>;
  mockGetFilteredScOutputEvent: () => jest.Mock<any, any, any>;

  constructor() {
    this.mockCallSmartContract = mockCallSmartContract;
    this.mockGetOperationStatus = mockGetOperationStatus;
    this.mockGetFilteredScOutputEvent = mockGetFilteredScOutputEvent;
  }

  setMockCallSmartContract(mockCallSmartContract: jest.Mock<any, any, any>) {
    this.mockCallSmartContract = mockCallSmartContract;
  }

  setMockGetOperationStatus(mockGetOperationStatus: jest.Mock<any, any, any>) {
    this.mockGetOperationStatus = mockGetOperationStatus;
  }

  setMockGetFilteredScOutputEvent(
    mockGetFilteredScOutputEvent: jest.Mock<any, any, any>,
  ) {
    this.mockGetFilteredScOutputEvent = mockGetFilteredScOutputEvent;
  }

  smartContracts(): SmartContracts {
    return {
      callSmartContract: this.mockCallSmartContract,
      getOperationStatus: this.mockGetOperationStatus,
      getFilteredScOutputEvents: this.mockGetFilteredScOutputEvent,
    };
  }
}

const mockCallSmartContract = jest
  .fn()
  .mockResolvedValueOnce('AkajksU1Q981h1sj');

const mockGetOperationStatus = jest
  .fn()
  .mockResolvedValueOnce(EOperationStatus.FINAL_SUCCESS);

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
                "mockLockTxId","evmToken": "985291424"}`,
  },
]);

export class Utils {
  writeAsync: () => jest.Mock<any, any, any>;
  constructor() {
    this.writeAsync = writeAsync;
  }

  setWriteAsync(writeAsync: jest.Mock<any, any, any>) {
    this.writeAsync = writeAsync;
  }
}

const writeAsync = jest
  .fn()
  .mockResolvedValueOnce(
    'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
  );
