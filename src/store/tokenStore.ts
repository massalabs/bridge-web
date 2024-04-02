/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BUILDNET,
  CHAIN_ID,
  Client,
  ClientFactory,
  DefaultProviderUrls,
  MAINNET,
} from '@massalabs/massa-web3';
import { create } from 'zustand';
import { getEVMSymbol, getMASSASymbol } from './helpers/tokenSymbol';
import { useAccountStore, useBridgeModeStore } from './store';
import { config } from '../const';
import { getSupportedTokensList } from '@/custom/bridge/bridge';
import {
  getAllowance,
  getMassaTokenSymbol,
  getDecimals,
  getMassaTokenName,
  getBalance,
} from '@/custom/token/token';
import {
  SELECTED_MASSA_TOKEN_KEY,
  _getFromStorage,
  _setInStorage,
} from '@/utils/storage';

export interface IToken {
  name: string;
  allowance: bigint; // MASSA token allowance
  decimals: number;
  symbol: string;
  symbolEVM: string;
  massaToken: string;
  evmToken: string;
  chainId: number;
  balance: bigint; // MASSA token balance
}

export interface TokenStoreState {
  selectedToken?: IToken;
  tokens: IToken[];

  setSelectedToken: (token?: IToken) => void;
  getTokens: () => void;
  refreshBalances: () => void;
}

async function initMassaClient(isMainnet: boolean): Promise<Client> {
  return ClientFactory.createDefaultClient(
    isMainnet ? DefaultProviderUrls.MAINNET : DefaultProviderUrls.BUILDNET,
    isMainnet ? CHAIN_ID[MAINNET] : CHAIN_ID[BUILDNET],
  );
}

export const useTokenStore = create<TokenStoreState>((set, get) => ({
  selectedToken: undefined,
  tokens: [],

  getTokens: async () => {
    const { isMainnet: getIsMainnet } = useBridgeModeStore.getState();

    const massaClient = await initMassaClient(getIsMainnet());

    let tokenList: IToken[] = [];
    try {
      const supportedTokens = await getSupportedTokensList(massaClient);

      tokenList = await Promise.all(
        supportedTokens.map(async (tokenPair) => {
          const [name, symbol, decimals] = await Promise.all([
            getMassaTokenName(tokenPair.massaToken, massaClient),
            getMassaTokenSymbol(tokenPair.massaToken, massaClient),
            getDecimals(tokenPair.massaToken, massaClient),
          ]);
          return {
            ...tokenPair,
            name,
            symbol: getMASSASymbol(symbol),
            symbolEVM: getEVMSymbol(symbol),
            decimals,
            allowance: BigInt(0),
            balance: BigInt(0),
          };
        }),
      );
    } catch (e) {
      console.warn('unable to get supported tokens list', e);
    }

    const storedToken = _getFromStorage(SELECTED_MASSA_TOKEN_KEY)
      ? JSON.parse(_getFromStorage(SELECTED_MASSA_TOKEN_KEY))
      : undefined;

    const selectedToken = tokenList.find(
      (token) => token.massaToken === storedToken?.massaToken,
    );

    set({ tokens: tokenList });
    get().refreshBalances();

    if (selectedToken) {
      get().setSelectedToken(selectedToken);
    } else {
      get().setSelectedToken(tokenList[0]);
    }
  },

  setSelectedToken: (selectedToken?: IToken) => {
    set({ selectedToken });
    _setInStorage(
      SELECTED_MASSA_TOKEN_KEY,
      selectedToken ? JSON.stringify(selectedToken) : '',
    );
  },

  refreshBalances: async () => {
    const { connectedAccount } = useAccountStore.getState();
    if (!connectedAccount) {
      return;
    }

    const { tokens: supportedTokens } = get();

    if (!supportedTokens.length) {
      // token list not fetched yet
      return;
    }

    const { isMainnet: getIsMainnet, currentMode } =
      useBridgeModeStore.getState();
    const isMainnet = getIsMainnet();

    const massaClient = await initMassaClient(isMainnet);

    const tokens = await Promise.all(
      supportedTokens.map(async (token) => {
        const [accountAllowance, accountBalance] = await Promise.all([
          getAllowance(
            config[currentMode].massaBridgeContract,
            token.massaToken,
            massaClient,
            connectedAccount,
          ),
          getBalance(token.massaToken, massaClient, connectedAccount),
        ]);
        token.allowance = accountAllowance;
        token.balance = accountBalance;
        return token;
      }),
    );
    set({ tokens });
  },
}));
