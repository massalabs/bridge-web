import { ReactNode } from 'react';

import {
  Dropdown,
  MassaLogo,
  MassaToken,
  Tooltip,
} from '@massalabs/react-ui-kit';
import { BsDiamondHalf } from 'react-icons/bs';
import {
  useAccount,
  useFeeData,
  useNetwork,
  useSwitchNetwork,
  useToken,
} from 'wagmi';

import { FetchingLine, FetchingStatus } from '../Loading';
import { Connected, Disconnected, NoAccounts, WrongChain } from '@/components';
import { LayoutType } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { IToken } from '@/store/accountStore';
import { useAccountStore } from '@/store/store';
import { MASSA_TO_EVM } from '@/utils/const';
import { formatStandard } from '@/utils/massaFormat';
import { formatAmount } from '@/utils/parseAmount';

interface Layout {
  header: ReactNode;
  wallet: ReactNode;
  token: ReactNode;
  fees: ReactNode;
  balance: ReactNode;
}

const iconsTokens = {
  MASSASTATION: <MassaLogo size={16} />,
  OTHER: <BsDiamondHalf />,
};

function getChainId(network = 'sepolia') {
  const { chains } = useNetwork();

  return chains.filter((c: { network: string }) => c.network === network).at(0)
    ?.id;
}

function TokenBalance({ ...props }: { amount?: bigint; layout?: LayoutType }) {
  let { amount, layout } = props;

  const [token] = useAccountStore((state) => [state.token]);

  const evmToken = token?.evmToken as `0x${string}`;
  const { data } = useToken({ address: evmToken });
  const decimals = data?.decimals || 18;

  let { in2decimals, full } = formatAmount(
    amount ? amount.toString() : '0',
    decimals,
  );
  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  let symbol = IS_MASSA_TO_EVM ? token?.symbol : token?.symbol.slice(0, -2);

  return (
    <div className="flex items-center">
      {in2decimals}{' '}
      <Tooltip
        customClass="mas-caption w-fit whitespace-nowrap"
        content={full + ' ' + symbol}
      />
    </div>
  );
}

function EVMHeader() {
  const { chain, chains } = useNetwork();
  const { isConnected } = useAccount();

  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  const SEPOLIA_CHAIN_ID = getChainId();
  const IS_EVM_SEPOLIA_CHAIN = chain?.id === SEPOLIA_CHAIN_ID;

  const iconsNetworks = {
    Sepolia: <BsDiamondHalf size={40} />,
    OTHER: <BsDiamondHalf />,
  };

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          readOnly={!isConnected || isFetching || !IS_EVM_SEPOLIA_CHAIN}
          options={
            chains.length
              ? chains.map((chain: { name: string }) => ({
                  item: chain.name + ' Testnet',
                  icon: iconsNetworks['Sepolia'],
                }))
              : [
                  {
                    icon: iconsNetworks['Sepolia'],
                    item: 'Sepolia Testnet',
                  },
                ]
          }
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">Metamask</p>
        {isConnected ? (
          !IS_EVM_SEPOLIA_CHAIN && isConnected ? (
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
  const [isFetching, accounts, isStationInstalled] = useAccountStore(
    (state) => [state.isFetching, state.accounts, state.isStationInstalled],
  );

  const hasNoAccounts = accounts?.length <= 0;

  function displayStatus() {
    if (!isStationInstalled) return <Disconnected />;
    else if (hasNoAccounts) return <NoAccounts />;
    return <Connected />;
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          readOnly={hasNoAccounts || isFetching}
          options={[
            {
              item: 'Massa Buildnet',
              icon: <MassaToken />,
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">Massa Wallet</p>
        {isFetching ? <FetchingStatus /> : displayStatus()}
      </div>
    </div>
  );
}

function EVMMiddle() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();

  const SEPOLIA_CHAIN_ID = getChainId();
  const IS_EVM_SEPOLIA_CHAIN = chain?.id === SEPOLIA_CHAIN_ID;

  return (
    <div>
      {IS_EVM_SEPOLIA_CHAIN ? null : (
        <div
          className="flex justify-end mas-h3 text-f-disabled-1 underline cursor-pointer"
          onClick={() => switchNetwork?.(SEPOLIA_CHAIN_ID)}
        >
          {Intl.t(`connect-wallet.connect-metamask.switch-network`)}
        </div>
      )}
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
    <div className="mb-4 flex items-center gap-2">
      <p className="mas-body2">Wallet address:</p>
      <div className="mas-caption">
        {isFetching ? <FetchingLine /> : connectedAccount?.address()}
      </div>
    </div>
  );
}

function EVMTokenOptions({ ...props }) {
  const { layout } = props;

  const [tokens, setToken, token, isFetching] = useAccountStore((state) => [
    state.tokens,
    state.setToken,
    state.token,
    state.isFetching,
  ]);

  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name.slice(0, -2) === token?.name.slice(0, -2),
    ) || '0',
  );

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={IS_MASSA_TO_EVM || isFetching}
      size="xs"
      options={tokens.map((token: IToken) => {
        return {
          item: token.symbol,
          icon: iconsTokens['OTHER'],
          onClick: () => setToken(token),
        };
      })}
    />
  );
}

function MassaTokenOptions({ ...props }) {
  const { layout } = props;

  const [tokens, setToken, token, isFetching] = useAccountStore((state) => [
    state.tokens,
    state.setToken,
    state.token,
    state.isFetching,
  ]);
  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name.slice(0, -2) === token?.name.slice(0, -2),
    ) || '0',
  );

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={!IS_MASSA_TO_EVM || isFetching}
      size="xs"
      options={tokens.map((token: IToken) => {
        return {
          item: token.symbol,
          icon: iconsTokens['MASSASTATION'],
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

  const [token, isFetching] = useAccountStore((state) => [
    state.token,
    state.isFetching,
  ]);

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
