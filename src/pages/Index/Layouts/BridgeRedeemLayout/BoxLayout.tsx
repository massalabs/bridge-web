import { ReactNode } from 'react';

import { Dropdown, MassaLogo, Tooltip } from '@massalabs/react-ui-kit';
import { FiAlertCircle } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { FetchingLine } from '../LoadingLayout/FetchingComponent';
import { BNBSvg } from '@/assets/BNBSvg';
import { EthSvg } from '@/assets/EthSvg';
import { SepoliaDaiSvg } from '@/assets/SepoliaDaiSvg';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
import { SepoliaWethSvg } from '@/assets/SepoliaWethSvg';
import { TDaiMassaSvg } from '@/assets/TDaiMassaSvg';
import { TDaiSvg } from '@/assets/TDaiSvg';
import { WEthMassaSvg } from '@/assets/WEthMassaSvg';
import { WEthSvg } from '@/assets/WEthSvg';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain, MASSA_TOKEN, SupportedTokens } from '@/const';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import useEvmToken from '@/custom/bridge/useEvmToken';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { IToken } from '@/store/tokenStore';
import { SIDE } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface Layout {
  header: ReactNode;
  wallet: ReactNode;
  token: ReactNode;
  balance: ReactNode;
}

interface IconsNetworks {
  [key: string]: JSX.Element;
}
export const iconsNetworks: IconsNetworks = {
  MAS: <MassaLogo size={40} />,
  ETH: <EthSvg size={40} />,
  SEP: <SepoliaSvg size={40} />,
  BNB: <BNBSvg size={40} />,
  tBNB: <BNBSvg size={40} />,
};

interface ChainOptions {
  icon: JSX.Element | undefined;
  item: string;
}

function EVMHeader() {
  const { isConnected } = useAccount();
  const { evmNetwork: getEvmNetwork, isMainnet: getIsMainnet } =
    useBridgeModeStore();
  const { chain } = useAccount();

  const evmNetwork = getEvmNetwork();
  const isMainnet = getIsMainnet();

  const chainName = chain?.name || undefined;
  const chainSymbol = chain?.nativeCurrency.symbol || undefined;

  function getCurrentChainInfo(): ChainOptions {
    if (!chainSymbol) {
      return {
        icon: <FiAlertCircle size={32} />,
        item: Intl.t(`general.${Blockchain.INVALID_CHAIN}`),
      };
    } else if (isMainnet) {
      return {
        icon: iconsNetworks[chainSymbol],
        item: `${chainName} ${Intl.t(`general.${evmNetwork}`)}`,
      };
    }
    return {
      icon: iconsNetworks[chainSymbol],
      item: `${chainName} ${Intl.t(`general.${evmNetwork}`)}`,
    };
  }

  const walletName = useConnectorName();

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown readOnly={true} options={[getCurrentChainInfo()]} />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">
          {isConnected
            ? walletName
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus blockchain={Blockchain.ETHEREUM} />
      </div>
    </div>
  );
}

function MassaHeader() {
  const { isFetching, accounts, currentProvider } = useAccountStore();
  const { massaNetwork: getMassaNetwork } = useBridgeModeStore();
  const massaNetwork = getMassaNetwork();

  const hasNoAccounts = !accounts?.length;

  const isConnected = !isFetching && currentProvider && !hasNoAccounts;

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          readOnly={true}
          options={[
            {
              item: `${Intl.t(`general.${Blockchain.MASSA}`)} ${Intl.t(
                `general.${massaNetwork}`,
              )}`,
              icon: iconsNetworks[MASSA_TOKEN],
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">
          {isConnected && currentProvider
            ? Intl.t(`connect-wallet.${currentProvider.name()}`)
            : Intl.t('connect-wallet.card-destination.to')}
        </p>
        <ChainStatus blockchain={Blockchain.MASSA} />
      </div>
    </div>
  );
}

function EVMMiddle() {
  const { address } = useAccount();

  return (
    <div className="mt-4 mb-4 flex items-center gap-2">
      <p className="mas-body2">{Intl.t('index.box-layout.wallet-address')}</p>
      <p className="mas-caption">{address}</p>
    </div>
  );
}

function MassaMiddle() {
  const [isFetching, connectedAccount] = useAccountStore((state) => [
    state.isFetching,
    state.connectedAccount,
  ]);

  return (
    <div className="mt-4 mb-4 flex items-center gap-2">
      <p className="mas-body2">{Intl.t('index.box-layout.wallet-address')}</p>
      <div className="mas-caption">
        {isFetching ? <FetchingLine /> : connectedAccount?.address()}
      </div>
    </div>
  );
}

interface TokenOptionsProps {
  nativeToken: boolean;
}

function TokenOptions(props: TokenOptionsProps) {
  const { nativeToken } = props;
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { isMassaToEvm: getIsMassaToEvm } = useOperationStore();
  const { isFetching } = useAccountStore();
  const { tokens, setSelectedToken, selectedToken } = useTokenStore();

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name === selectedToken?.name,
    ) || '0',
  );

  const isMainnet = getIsMainnet();
  const isMassaToEvm = getIsMassaToEvm();

  let readOnlyDropdown;
  if (isMassaToEvm) {
    readOnlyDropdown = !isMassaToEvm || isFetching;
  } else {
    readOnlyDropdown = isMassaToEvm || isFetching;
  }

  function getTokenIcons() {
    if (!nativeToken) {
      return {
        tDAI: <TDaiSvg />,
        WETH: <WEthSvg />,
      };
    } else if (isMainnet) {
      return {
        tDAI: <TDaiMassaSvg />,
        WETH: <WEthMassaSvg />,
      };
    }
    return {
      tDAI: <SepoliaDaiSvg />,
      WETH: <SepoliaWethSvg />,
    };
  }

  function getIcon(token: IToken): JSX.Element {
    const icons = {
      tDAI: getTokenIcons().tDAI,
      WETH: getTokenIcons().WETH,
    };
    return icons[token.symbol as SupportedTokens];
  }

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={readOnlyDropdown}
      size="md"
      options={tokens.map((token: IToken) => {
        return {
          item: isMassaToEvm ? token.symbol : token.symbolEVM,
          icon: getIcon(token),
          onClick: () => setSelectedToken(token),
        };
      })}
    />
  );
}

function TokenBalance() {
  const { isMassaToEvm } = useOperationStore();
  const { selectedToken } = useTokenStore();
  const { tokenBalance: tokenBalanceEvm, isFetched } = useEvmToken();

  const decimals = selectedToken?.decimals || 18;

  let amount: bigint | undefined;
  let symbol: string | undefined;
  if (isMassaToEvm()) {
    amount = selectedToken?.balance;
    symbol = selectedToken?.symbol;
  } else {
    amount = tokenBalanceEvm;
    symbol = selectedToken?.symbolEVM;
  }

  let { amountFormattedPreview, amountFormattedFull } = formatAmount(
    amount ? amount.toString() : '0',
    decimals,
  );

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      </p>
      <div className="mas-body">
        {!isFetched || amount === undefined ? (
          <FetchingLine />
        ) : (
          <div className="flex items-center">
            {amountFormattedPreview}
            <Tooltip
              customClass="mas-caption w-fit whitespace-nowrap"
              body={amountFormattedFull + ' ' + symbol ?? ''}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface BoxLayoutResult {
  up: Layout;
  down: Layout;
}

export function boxLayout(): BoxLayoutResult {
  const { side } = useOperationStore.getState();

  const layouts = {
    [SIDE.MASSA_TO_EVM]: {
      up: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions nativeToken={true} />,
        balance: <TokenBalance />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions nativeToken={false} />,
        balance: null,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions nativeToken={false} />,
        balance: <TokenBalance />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions nativeToken={true} />,
        balance: null,
      },
    },
  };

  return layouts[side];
}
