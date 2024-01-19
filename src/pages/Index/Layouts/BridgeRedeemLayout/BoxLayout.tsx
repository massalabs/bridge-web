import { ReactNode, useEffect, useState } from 'react';

import { Dropdown, MassaLogo, Tooltip } from '@massalabs/react-ui-kit';
import { BsDiamondHalf } from 'react-icons/bs';
import {
  useAccount,
  useFeeData,
  useNetwork,
  useSwitchNetwork,
  useToken,
} from 'wagmi';
import {
  FetchingLine,
  FetchingStatus,
} from '../LoadingLayout/FetchingComponent';
import { EthSvg } from '@/assets/EthSvg';
import { TDaiSvg } from '@/assets/TDaiSvg';
import { WEthSvg } from '@/assets/WEthSvg';
import { Connected, Disconnected, NoAccounts, WrongChain } from '@/components';
import { LayoutType, SUPPORTED_MASSA_WALLETS } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';
import { IToken } from '@/store/tokenStore';
import {
  ETH_MAINNET_CHAIN_ID,
  MASSA_TO_EVM,
  SEPOLIA_CHAIN_ID,
} from '@/utils/const';
import { formatStandard } from '@/utils/massaFormat';
import {
  MassaNetworks,
  validateEvmNetwork,
  validateMassaNetwork,
} from '@/utils/network';
import { formatAmount } from '@/utils/parseAmount';
import { capitalize } from '@/utils/utils';

interface Layout {
  header: ReactNode;
  wallet: ReactNode;
  token: ReactNode;
  fees: ReactNode;
  balance: ReactNode;
}

export interface IIcons {
  [key: string]: object;
}

const iconsNetworks = {
  MASSASTATION: <MassaLogo size={40} />,
  ETHEREUM: <BsDiamondHalf size={40} />,
};

const iconsTokens: IIcons = {
  massaToEvm: {
    tDAI: <EthSvg />,
    WETH: <EthSvg />,
  },
  evmToMassa: {
    tDAI: <TDaiSvg />,
    WETH: <WEthSvg />,
  },
};

function TokenBalance({ ...props }: { amount?: bigint; layout?: LayoutType }) {
  let { amount } = props;

  const [token] = useTokenStore((state) => [state.selectedToken]);

  const evmToken = token?.evmToken as `0x${string}`;
  const { data } = useToken({ address: evmToken });
  const decimals = data?.decimals || 18;

  let { in2decimals, full } = formatAmount(
    amount ? amount.toString() : '0',
    decimals,
  );

  return (
    <div className="flex items-center">
      {in2decimals}
      <Tooltip
        customClass="mas-caption w-fit whitespace-nowrap"
        content={full + ' ' + token?.symbol ?? ''}
      />
    </div>
  );
}

function EVMHeader() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { isMainnet } = useBridgeModeStore();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);
  useEffect(() => {
    setWrongNetwork(!validateEvmNetwork(isMainnet, chain?.id));
  }, [isMainnet, chain]);

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          readOnly={true}
          options={[
            {
              // todo add icons if we want to support different chains
              icon: iconsNetworks.ETHEREUM,
              item: isMainnet ? 'Ethereum Mainnet' : 'Sepolia Testnet',
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">Metamask</p>
        {isConnected ? (
          wrongNetwork ? (
            <WrongChain />
          ) : (
            <Connected />
          )
        ) : (
          <Disconnected />
        )}
      </div>
    </div>
  );
}

function MassaHeader() {
  const { isFetching, accounts, currentProvider, connectedNetwork } =
    useAccountStore();
  const { isMainnet } = useBridgeModeStore();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);
  useEffect(() => {
    setWrongNetwork(!validateMassaNetwork(isMainnet, connectedNetwork));
  }, [isMainnet, connectedNetwork]);

  const hasNoAccounts = !accounts.length;

  function displayStatus() {
    if (isFetching) return <FetchingStatus />;
    else if (!currentProvider) return <Disconnected />;
    else if (wrongNetwork) return <WrongChain />;
    else if (hasNoAccounts) return <NoAccounts />;
    return <Connected />;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          readOnly={true}
          options={[
            {
              item: `Massa ${capitalize(
                isMainnet ? MassaNetworks.mainnet : MassaNetworks.buildnet,
              )}`,
              icon: iconsNetworks[SUPPORTED_MASSA_WALLETS.MASSASTATION],
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">Massa</p>
        {displayStatus()}
      </div>
    </div>
  );
}

function EVMMiddle() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { address, isConnected } = useAccount();
  const { isMainnet } = useBridgeModeStore();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);
  useEffect(() => {
    setWrongNetwork(!validateEvmNetwork(isMainnet, chain?.id));
  }, [isMainnet, chain]);

  return (
    <div>
      {isConnected && wrongNetwork ? (
        <div
          className="flex justify-end mas-h3 text-f-disabled-1 underline cursor-pointer"
          onClick={() =>
            switchNetwork?.(isMainnet ? ETH_MAINNET_CHAIN_ID : SEPOLIA_CHAIN_ID)
          }
        >
          {Intl.t('connect-wallet.connect-metamask.switch-network')}
        </div>
      ) : null}
      <div className="mt-4 mb-4 flex items-center gap-2">
        <p className="mas-body2">Wallet address:</p>
        <p className="mas-caption">{address}</p>
      </div>
    </div>
  );
}

function MassaMiddle() {
  const [isFetching, connectedAccount] = useAccountStore((state) => [
    state.isFetching,
    state.connectedAccount,
  ]);

  return (
    <div>
      <div className="mt-4 mb-4 flex items-center gap-2">
        <p className="mas-body2">Wallet address:</p>
        <div className="mas-caption">
          {isFetching ? <FetchingLine /> : connectedAccount?.address()}
        </div>
      </div>
    </div>
  );
}

function EVMTokenOptions({ ...props }) {
  const { layout } = props;

  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  const [token, tokens, setToken] = useTokenStore((state) => [
    state.selectedToken,
    state.tokens,
    state.setSelectedToken,
  ]);

  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find((_, idx) => tokens[idx].name === token?.name) ||
      '0',
  );

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={IS_MASSA_TO_EVM || isFetching}
      size="xs"
      options={tokens.map((token: IToken) => {
        return {
          item: token.symbol,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          icon: iconsTokens['evmToMassa'][token.symbol],
          onClick: () => setToken(token),
        };
      })}
    />
  );
}

function MassaTokenOptions({ ...props }) {
  const { layout } = props;

  const [isFetching] = useAccountStore((state) => [state.isFetching]);
  const [tokens, setToken, token] = useTokenStore((state) => [
    state.tokens,
    state.setSelectedToken,
    state.selectedToken,
  ]);
  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find((_, idx) => tokens[idx].name === token?.name) ||
      '0',
  );

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={!IS_MASSA_TO_EVM || isFetching}
      size="xs"
      options={tokens.map((token: IToken) => {
        return {
          item: token.symbol,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          icon: iconsTokens['massaToEvm'][token.symbol],
          onClick: () => setToken(token),
        };
      })}
    />
  );
}

function EVMFees() {
  const { data, isLoading } = useFeeData();

  return (
    <div className="flex items-center gap-2">
      <p className="mas-body2">Total EVM fees:</p>
      <div className="mas-body">
        {isLoading ? <FetchingLine /> : data?.formatted.maxFeePerGas}
      </div>
    </div>
  );
}

function MassaFees() {
  return (
    <div className="flex items-center gap-2">
      <p className="mas-body2">Total Massa fees:</p>
      <p className="mas-body">{formatStandard(Number(0))}</p>
    </div>
  );
}

function EVMBalance({ ...props }) {
  const { layout } = props;

  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  const { tokenBalance } = useEvmBridge();

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">Balance:</p>
      <div className="mas-body">
        {isFetching ? (
          <FetchingLine />
        ) : (
          <TokenBalance amount={tokenBalance} layout={layout} />
        )}
      </div>
    </div>
  );
}

function MassaBalance({ ...props }) {
  const { layout } = props;

  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  const [token] = useTokenStore((state) => [state.selectedToken]);

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">Balance:</p>
      <div className="mas-body">
        {isFetching ? (
          <FetchingLine />
        ) : (
          <TokenBalance amount={token?.balance} layout={layout} />
        )}
      </div>
    </div>
  );
}

export function boxLayout(layout: LayoutType = 'massaToEvm'): {
  up: Layout;
  down: Layout;
} {
  const layouts = {
    massaToEvm: {
      up: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <MassaTokenOptions layout={layout} />,
        fees: null,
        balance: <MassaBalance layout={layout} />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <EVMTokenOptions layout={layout} />,
        fees: <MassaFees />,
        balance: null,
      },
    },
    evmToMassa: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <EVMTokenOptions layout={layout} />,
        fees: null,
        balance: <EVMBalance layout={layout} />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <MassaTokenOptions layout={layout} />,
        fees: <EVMFees />,
        balance: null,
      },
    },
  };

  return layouts[layout];
}
