import { IAccount } from '@massalabs/massa-web3';
import {
  GlobalStatusesStoreState,
  Status,
} from '../../src/store/globalStatusesStore';
import { useGlobalStatusesStore } from '../../src/store/store';

const account = { address: 'toto' } as any as IAccount;

export let globalStatusesStoreMock: jest.SpyInstance<GlobalStatusesStoreState>;

export const globalStatusesStoreStateMock = {
  box: Status.None,
  approve: Status.None,
  burn: Status.None,
  claim: Status.None,
  lock: Status.None,
  mint: Status.None,
  error: Status.None,
  setBox: jest.fn().mockImplementation(),
  setApprove: jest.fn().mockImplementation(),
  setBurn: jest.fn().mockImplementation(),
  setClaim: jest.fn().mockImplementation(),
  setLock: jest.fn().mockImplementation(),
  setMint: jest.fn().mockImplementation(),
  setError: jest.fn().mockImplementation(),
  reset: jest.fn().mockImplementation(),
} as GlobalStatusesStoreState;

export const initGlobalStatusesStoreMock = () => {
  globalStatusesStoreMock = jest
    .spyOn(useGlobalStatusesStore, 'getState')
    .mockImplementation(
      (): GlobalStatusesStoreState => globalStatusesStoreStateMock,
    );
};
