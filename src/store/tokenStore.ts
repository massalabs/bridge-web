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
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
} from './store';
import { SUPPORTED_BLOCKCHAIN_TO_CHAIN_IDS, config } from '../const';
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

  /** Return the token filtered by supported token on the current selected evm chain */
  getTokens(): IToken[];
  /** Set the selected token if included in the list of the supported token on the current selected evm chain */
  setSelectedToken: (token?: IToken) => void;
  /** Reset selected token to the first token in the list of the supported token on the current selected evm chain */
  resetSelectedToken: () => void;
  /** Refresh the list of supported tokens by reading the massa bridge smart contract */
  refreshTokens: () => void;
  refreshBalances: () => void;

  setAddrInfo: () => void;
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

  getTokens: () => {
    const { selectedEvm } = useOperationStore.getState();
    return get().tokens.filter((token) =>
      SUPPORTED_BLOCKCHAIN_TO_CHAIN_IDS[selectedEvm].includes(token.chainId),
    );
  },

  refreshTokens: async () => {
    const { isMainnet: getIsMainnet } = useBridgeModeStore.getState();

    const publicClient = await initMassaClient(getIsMainnet());

    let tokenList: IToken[] = [];
    try {
      const supportedTokens = await getSupportedTokensList(publicClient);
      if (!supportedTokens?.length) {
        set({ tokens: [] });
        return;
      }

      tokenList = await Promise.all(
        supportedTokens.map(async (tokenPair) => {
          const [name, symbol, decimals] = await Promise.all([
            getMassaTokenName(tokenPair.massaToken, publicClient),
            getMassaTokenSymbol(tokenPair.massaToken, publicClient),
            getDecimals(tokenPair.massaToken, publicClient),
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
    // if given undefined, set undefined
    if (!selectedToken) {
      set({ selectedToken });
    }
    // if selected token is not in the list, set first selectable token
    // selectable is the token supported on the current evm chain selected
    const selectable = get().getTokens();
    if (selectedToken && selectable.includes(selectedToken)) {
      set({ selectedToken });
    } else {
      set({ selectedToken: selectable[0] });
    }
    _setInStorage(
      SELECTED_MASSA_TOKEN_KEY,
      selectedToken ? JSON.stringify(selectedToken) : '',
    );

    get().setAddrInfo();
  },

  resetSelectedToken: () => {
    set({ selectedToken: get().getTokens()[0] });
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

    const publicClient = await initMassaClient(getIsMainnet());

    const tokens = await Promise.all(
      supportedTokens.map(async (token) => {
        const [accountAllowance, accountBalance] = await Promise.all([
          getAllowance(
            config[currentMode].massaBridgeContract,
            token.massaToken,
            publicClient,
            connectedAccount,
          ),
          getBalance(token.massaToken, publicClient, connectedAccount),
        ]);
        token.allowance = accountAllowance;
        token.balance = accountBalance;
        return token;
      }),
    );
    set({ tokens });
  },
  setAddrInfo: async () => {
    const client = useAccountStore.getState().massaClient;
    const selectedToken = get().selectedToken;

    if (!selectedToken) return;

    useAccountStore.setState({
      addrInfo: await client
        ?.publicApi()
        .getAddresses([selectedToken?.massaToken]),
    });
  },
}));
