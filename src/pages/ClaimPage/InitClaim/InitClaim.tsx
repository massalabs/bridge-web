import { useEffect } from 'react';
import { Button, formatAmount } from '@massalabs/react-ui-kit';
import { useAccount, useSwitchChain } from 'wagmi';
import { handleEvmClaimError } from '../../../custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '../../../custom/bridge/useClaim';
import { CHAIN_ID_TO_SERVICE_FEE } from '@/const';
import Intl from '@/i18n/i18n';
import { OperationInfo, PendingClaim } from '@/pages';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { BurnRedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';
import { CustomError } from '@/utils/error';
import { getAmountToReceive } from '@/utils/utils';

interface InitClaimProps {
  operation: BurnRedeemOperation;
  symbol: string;
  decimals: number;
  onUpdate: (op: Partial<BurnRedeemOperation>) => void;
}

export function InitClaim(props: InitClaimProps) {
  const { operation, symbol, onUpdate, decimals } = props;
  const { write, error, isSuccess, hash, isPending } = useClaim();
  const { setClaim } = useGlobalStatusesStore();

  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const serviceFee = CHAIN_ID_TO_SERVICE_FEE[operation.evmChainId];

  // calculates amount received
  const receivedAmount = getAmountToReceive(
    BigInt(operation.amount),
    serviceFee,
  );

  // format amount received
  const { full } = formatAmount(receivedAmount, decimals);

  const claimState = operation.claimState;
  const isChainIncompatible = chainId !== operation.evmChainId;

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
        setClaim(Status.Error);
      }
    }
  }, [
    isPending,
    error,
    isSuccess,
    hash,
    claimState,
    operation,
    onUpdate,
    setClaim,
  ]);

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
      <OperationInfo
        claimState={claimState}
        operation={operation}
        symbol={symbol}
        amountRedeemedFull={full}
      />
      <div className="flex flex-col gap-2">
        <Button onClick={() => handleClaim()}>
          {Intl.t('claim.claim')} {full} {symbol}
        </Button>
        {isChainIncompatible && (
          <div className="w-56">{Intl.t('claim.wrong-network')}</div>
        )}
      </div>
    </div>
  );
}
