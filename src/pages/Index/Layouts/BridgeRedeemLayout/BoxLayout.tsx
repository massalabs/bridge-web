import { ReactNode } from 'react';

import { Dropdown, MassaLogo, Tooltip } from '@massalabs/react-ui-kit';
import { BsDiamondHalf } from 'react-icons/bs';
import { useAccount, useFeeData, useToken } from 'wagmi';
import { FetchingLine } from '../LoadingLayout/FetchingComponent';
import { EthSvg } from '@/assets/EthSvg';
import { TDaiSvg } from '@/assets/TDaiSvg';
import { WEthSvg } from '@/assets/WEthSvg';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain, SUPPORTED_MASSA_WALLETS } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';
import { IToken } from '@/store/tokenStore';
import { SIDE } from '@/utils/const';
import { formatStandard } from '@/utils/massaFormat';
import { MassaNetworks } from '@/utils/network';
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
  [SIDE.MASSA_TO_EVM]: {
    tDAI: <EthSvg />,
    WETH: <EthSvg />,
  },
  [SIDE.EVM_TO_MASSA]: {
    tDAI: <TDaiSvg />,
    WETH: <WEthSvg />,
  },
};

interface TokenBalanceProps {
  amount?: bigint;
}

function TokenBalance(props: TokenBalanceProps) {
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
  const { isConnected } = useAccount();
  const { isMainnet } = useBridgeModeStore();

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
        <p className="mas-body">
          {isConnected
            ? 'Metamask'
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus blockchain={Blockchain.ETHEREUM} />
      </div>
    </div>
  );
}

function MassaHeader() {
  const { isFetching, accounts, currentProvider } = useAccountStore();
  const { isMainnet } = useBridgeModeStore();

  const hasNoAccounts = !accounts.length;

  const isConnected = !isFetching && currentProvider && !hasNoAccounts;

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
    <div>
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

  const IS_MASSA_TO_EVM = layout === SIDE.MASSA_TO_EVM;

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
          icon: iconsTokens[SIDE.EVM_TO_MASSA][token.symbol],
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
  const IS_MASSA_TO_EVM = layout === SIDE.MASSA_TO_EVM;

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
          icon: iconsTokens[SIDE.MASSA_TO_EVM][token.symbol],
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

function EVMBalance() {
  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  const { tokenBalance } = useEvmBridge();

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">Balance:</p>
      <div className="mas-body">
        {isFetching ? <FetchingLine /> : <TokenBalance amount={tokenBalance} />}
      </div>
    </div>
  );
}

function MassaBalance() {
  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  const [token] = useTokenStore((state) => [state.selectedToken]);

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">Balance:</p>
      <div className="mas-body">
        {isFetching ? (
          <FetchingLine />
        ) : (
          <TokenBalance amount={token?.balance} />
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
  const { side } = useBridgeModeStore.getState();

  const layouts = {
    [SIDE.MASSA_TO_EVM]: {
      up: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <MassaTokenOptions />,
        fees: null,
        balance: <MassaBalance />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <EVMTokenOptions />,
        fees: <MassaFees />,
        balance: null,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <EVMTokenOptions />,
        fees: null,
        balance: <EVMBalance />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <MassaTokenOptions />,
        fees: <EVMFees />,
        balance: null,
      },
    },
  };

  return layouts[side];
}
