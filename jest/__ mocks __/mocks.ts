import { EOperationStatus } from '@massalabs/massa-web3';

export const smartContractsMock = {
  callSmartContract: jest.fn(),
  getOperationStatus: jest.fn(),
  getFilteredScOutputEvents: jest.fn(),
};

export const massaClientMock = {
  smartContracts() {
    return smartContractsMock;
  },
};

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
