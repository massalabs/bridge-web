import { IAccount } from '@massalabs/massa-web3';
import { massaClientMock } from './mocks';
import { AccountStoreState } from '../../src/store/accountStore';
import { useAccountStore } from '../../src/store/store';

const account = { address: 'toto' } as any as IAccount;

export let accountStoreMock: jest.SpyInstance<AccountStoreState>;

export const initAccountStoreMock = () => {
  accountStoreMock = jest.spyOn(useAccountStore, 'getState').mockImplementation(
    (): AccountStoreState =>
      ({
        connectedAccount: account,
        massaClient: massaClientMock,
        accounts: [account],
        currentProvider: undefined,
        providers: [],
        isFetching: false,
        accountObserver: undefined,
        networkObserver: undefined,
        connectedNetwork: 'buildnet',
        setProviders: jest.fn(),
        setTosAcceptance: jest.fn(),
        tosAcceptance: true,
      } as any as AccountStoreState),
  );
};
