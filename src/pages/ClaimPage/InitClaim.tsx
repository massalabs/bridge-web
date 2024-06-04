import { useEffect } from 'react';
import {
  Tooltip,
  Button,
  formatAmount,
  getAssetIcons,
  Sepolia,
  Eth,
  Bsc,
} from '@massalabs/react-ui-kit';
import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains';
import { useAccount, useSwitchChain } from 'wagmi';
import { handleEvmClaimError } from '../../custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '../../custom/bridge/useClaim';

import { Spinner } from '@/components';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { BurnRedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';
import { CustomError } from '@/utils/error';
import { maskAddress } from '@/utils/massaFormat';

interface InitClaimProps {
  operation: BurnRedeemOperation;
  symbol: string;
  decimals?: number;
  onUpdate: (op: Partial<BurnRedeemOperation>) => void;
}

export function InitClaim(props: InitClaimProps) {
  const { operation, symbol, decimals, onUpdate } = props;
  const { write, error, isSuccess, hash, isPending } = useClaim();
  const { setClaim } = useGlobalStatusesStore();

  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const claimState = operation.claimState;
  const isChainIncompatible = chainId !== operation.evmChainId;

  let { amountFormattedPreview } = formatAmount(operation.amount, decimals);

  useEffect(() => {
    if (isPending && claimState !== ClaimState.PENDING) {
      onUpdate({ claimState: ClaimState.PENDING });
    }
    if (
      isSuccess &&
      hash &&
      claimState !== ClaimState.SUCCESS &&
      !operation.outputId
    ) {
      onUpdate({ outputId: hash, claimState: ClaimState.SUCCESS });
    }
    if (error) {
      const errorClaimState = handleEvmClaimError(error);
      if (claimState !== errorClaimState) {
        onUpdate({ claimState: errorClaimState });
      }
    }
  }, [isPending, error, isSuccess, hash, claimState, operation, onUpdate]);

  function writeClaim() {
    write({
      amount: operation.amount,
      recipient: operation.recipient,
      inputOpId: operation.inputId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      evmToken: operation.evmToken!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      signatures: operation.signatures!,
      chainId: operation.evmChainId,
    });
  }

  async function handleClaim() {
    onUpdate({ claimState: ClaimState.AWAITING_SIGNATURE });
    setClaim(Status.Loading);

    if (isChainIncompatible) {
      try {
        await switchChainAsync({ chainId: operation.evmChainId });
      } catch (e) {
        const typedError = e as CustomError;
        const errorClaimState = handleEvmClaimError(typedError);
        onUpdate({ claimState: errorClaimState });
        return;
      }
    }
    writeClaim();
  }

  if (
    claimState === ClaimState.PENDING ||
    claimState === ClaimState.AWAITING_SIGNATURE
  ) {
    return <PendingClaim />;
  }

  return (
    <div
      className={`flex justify-between 
          bg-secondary/50  backdrop-blur-lg text-f-primary 
          w-[720px] h-fit border border-tertiary rounded-2xl p-10`}
    >
      <DisplayContent
        claimState={claimState}
        operation={operation}
        symbol={symbol}
        decimals={decimals}
      />
      <div className="flex flex-col gap-2">
        <Button onClick={() => handleClaim()}>
          {Intl.t('claim.claim')} {amountFormattedPreview} {symbol}
        </Button>
        {isChainIncompatible && (
          <div className="w-56">{Intl.t('claim.wrong-network')}</div>
        )}
      </div>
    </div>
  );
}

function PendingClaim() {
  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[720px] h-12 border border-tertiary 
          mas-menu-active rounded-2xl px-10 py-14 text-menu-active"
    >
      <p>{Intl.t('claim.pending')}</p>
      <Spinner size="md" />
    </div>
  );
}

interface DisplayContentProps {
  claimState: ClaimState;
  operation: BurnRedeemOperation;
  symbol: string;
  decimals?: number;
}

function DisplayContent(props: DisplayContentProps) {
  const { claimState, operation, symbol, decimals } = props;
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(
    operation.amount,
    decimals,
  );

  const isClaimRejected = claimState === ClaimState.REJECTED;

  if (isClaimRejected) {
    return (
      <div>
        {Intl.t('claim.rejected-1')}
        <strong>
          {amountFormattedPreview} {symbol}
        </strong>
        {Intl.t('claim.rejected-2')}
      </div>
    );
  } else if (!isClaimRejected) {
    return (
      <div className="flex flex-col gap-4">
        <strong className="flex items-center gap-2">
          {getAssetIcons(symbol, operation.evmChainId, true, 26)}
          {amountFormattedPreview} {symbol}
          <Tooltip body={amountFormattedFull + ' ' + symbol} />
        </strong>

        <div className="flex items-center gap-2">
          {getEvmNetworkIcon(operation.evmChainId, 24)}
          {getEvmChainName(operation.evmChainId)}
        </div>
        <div>{maskAddress(operation.recipient, 4)}</div>
      </div>
    );
  }
}

interface EvmIcons {
  [key: string]: JSX.Element;
}

export function getEvmNetworkIcon(
  chainId: number,

  size = 16,
) {
  const evmIcons: EvmIcons = {
    [mainnet.id]: <Eth size={size} />,
    [sepolia.id]: <Sepolia size={size} />,
    [bsc.id]: <Bsc size={size} />,
    [bscTestnet.id]: <Bsc size={size} />,
  };

  return evmIcons[chainId];
}

export function getEvmChainName(chainId: number) {
  const chains = [mainnet, sepolia, bsc, bscTestnet];

  return chains.find((x) => x.id === chainId)?.name;
}
