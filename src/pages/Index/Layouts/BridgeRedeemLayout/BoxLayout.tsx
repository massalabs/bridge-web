import { ReactNode } from 'react';

import { Dropdown, MassaLogo, Tooltip } from '@massalabs/react-ui-kit';
import { BsDiamondHalf } from 'react-icons/bs';
import { useAccount, useFeeData } from 'wagmi';
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
  useOperationStore,
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

const iconsNetworks = {
  MASSASTATION: <MassaLogo size={40} />,
  ETHEREUM: <BsDiamondHalf size={40} />,
};

const iconsTokens = {
  [SIDE.MASSA_TO_EVM]: {
    tDAI: <EthSvg />,
    WETH: <EthSvg />,
  },
  [SIDE.EVM_TO_MASSA]: {
    tDAI: <TDaiSvg />,
    WETH: <WEthSvg />,
  },
};

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

  const hasNoAccounts = !accounts?.length;

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

function TokenOptions(props: { layoutSide: SIDE }) {
  const { side } = useOperationStore.getState();
  const { isFetching } = useAccountStore();
  const { tokens, setSelectedToken, selectedToken } = useTokenStore();

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name === selectedToken?.name,
    ) || '0',
  );

  const massaToEvm = side === SIDE.MASSA_TO_EVM;
  let readOnlyDropdown;
  if (props.layoutSide === SIDE.MASSA_TO_EVM) {
    readOnlyDropdown = !massaToEvm || isFetching;
  } else {
    readOnlyDropdown = massaToEvm || isFetching;
  }

  return (
    <Dropdown
      select={selectedMassaTokenKey}
      readOnly={readOnlyDropdown}
      size="xs"
      options={tokens.map((token: IToken) => {
        return {
          item:
            props.layoutSide === SIDE.MASSA_TO_EVM
              ? token.symbol
              : token.symbolEVM,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          icon: iconsTokens[side][token.symbolEVM],
          onClick: () => setSelectedToken(token),
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

function TokenBalance(props: { layoutSide: SIDE }) {
  const { isFetching } = useAccountStore();

  const { selectedToken } = useTokenStore();
  const { tokenBalance: tokenBalanceEvm } = useEvmBridge();

  const decimals = selectedToken?.decimals || 18;

  let amount;
  let symbol;
  if (props.layoutSide === SIDE.MASSA_TO_EVM) {
    amount = selectedToken?.balance;
    symbol = selectedToken?.symbol;
  } else {
    amount = tokenBalanceEvm;
    symbol = selectedToken?.symbolEVM;
  }

  let { in2decimals, full } = formatAmount(
    amount ? amount.toString() : '0',
    decimals,
  );

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      </p>
      <div className="mas-body">
        {isFetching ? (
          <FetchingLine />
        ) : (
          <div className="flex items-center">
            {in2decimals}
            <Tooltip
              customClass="mas-caption w-fit whitespace-nowrap"
              body={full + ' ' + symbol ?? ''}
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
        token: <TokenOptions layoutSide={SIDE.MASSA_TO_EVM} />,
        fees: null,
        balance: <TokenBalance layoutSide={SIDE.MASSA_TO_EVM} />,
      },
      down: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions layoutSide={SIDE.EVM_TO_MASSA} />,
        fees: <MassaFees />,
        balance: null,
      },
    },
    [SIDE.EVM_TO_MASSA]: {
      up: {
        header: <EVMHeader />,
        wallet: <EVMMiddle />,
        token: <TokenOptions layoutSide={SIDE.EVM_TO_MASSA} />,
        fees: null,
        balance: <TokenBalance layoutSide={SIDE.EVM_TO_MASSA} />,
      },
      down: {
        header: <MassaHeader />,
        wallet: <MassaMiddle />,
        token: <TokenOptions layoutSide={SIDE.MASSA_TO_EVM} />,
        fees: <EVMFees />,
        balance: null,
      },
    },
  };

  return layouts[side];
}
