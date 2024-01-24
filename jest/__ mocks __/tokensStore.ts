import { TokenStoreState, useTokenStore } from '../../src/store/tokenStore';

export const allowance = 123456789n;
const token = {
  name: 'Massa',
  allowance,
  decimals: 2,
  symbol: 'MAS',
  massaToken: 'MAST',
  evmToken: 'EVMT',
  chainId: 1091029012,
  balance: 1000n,
};

export let tokenStoreMock: jest.SpyInstance<TokenStoreState>;

export const initTokenStoreMock = () => {
  tokenStoreMock = jest.spyOn(useTokenStore, 'getState').mockImplementation(
    (): TokenStoreState =>
      ({
        selectedToken: token,
        tokens: [token],
      } as any as TokenStoreState),
  );
};
