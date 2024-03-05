import { useState, SyntheticEvent, useEffect, useCallback } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';
import { PendingOperationLayout } from './Layouts/LoadingLayout/PendingOperationLayout';
import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';
import { Tos } from '@/components/Tos';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { handleBurnRedeem } from '@/custom/bridge/handlers/handleBurnRedeem';
import { validate } from '@/custom/bridge/handlers/validateTransaction';
import { useEvmApprove } from '@/custom/bridge/useEvmApprove';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useIsBscConnected } from '@/custom/bridge/useIsBscConnected';
import { useLock } from '@/custom/bridge/useLock';
import { useNetworkCheck } from '@/custom/bridge/useNetworkCheck';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { BurnState } from '@/utils/const';

export function Index() {
  const { massaClient, connectedAccount, isFetching } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { side, amount, setAmount, resetTxIDs, isMassaToEvm } =
    useOperationStore();

  const massaToEvm = isMassaToEvm();

  const { address: evmAddress } = useAccount();

  const { allowance: allowanceEVM, tokenBalance: tokenBalanceEVM } =
    useEvmToken();

  const [burnState, setBurnState] = useState<BurnState>(BurnState.INIT);

  const { box, setBox, setLock, setApprove, reset, setAmountError } =
    useGlobalStatusesStore();

  const { wrongNetwork } = useNetworkCheck();

  const { write: writeEvmApprove } = useEvmApprove();

  const { write: writeLock } = useLock();

  const isOperationPending = box !== Status.None;
  const isBlurred = isOperationPending ? 'blur-md' : '';
  const isMainnet = getIsMainnet();

  const isBscConnected = useIsBscConnected();

  const isButtonDisabled =
    isBscConnected ||
    isFetching ||
    !connectedAccount ||
    wrongNetwork ||
    isMainnet ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  useEffect(() => {
    setAmountError('');
  }, [amount, side, selectedToken?.name, setAmountError]);

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmount();
    setBurnState(BurnState.INIT);
    // Reset all transaction id's
    resetTxIDs();
  }, [reset, setAmount, resetTxIDs]);

  useEffect(() => {
    if (box === Status.None) closeLoadingBox();
  }, [box, closeLoadingBox]);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    // validate amount to transact
    if (!validate(tokenBalanceEVM) || !amount) return;
    setBox(Status.Loading);

    if (massaToEvm) {
      if (!massaClient) {
        return;
      }
      const approved = await handleApproveRedeem(amount);

      if (approved) {
        if (!evmAddress) {
          return;
        }

        await handleBurnRedeem({
          recipient: evmAddress,
          amount,
          setBurnState,
        });
      }
    } else {
      if (!selectedToken) {
        return;
      }
      setApprove(Status.Loading);
      let parsedAmount = parseUnits(amount, selectedToken.decimals);
      const needApproval = allowanceEVM < parsedAmount;

      if (needApproval) {
        writeEvmApprove();
        return;
      }
      setApprove(Status.Success);
      setLock(Status.Loading);
      writeLock();
    }
  }

  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full min-h-screen">
      {/* If loading -> show loading layout else show home page*/}
      {isOperationPending ? (
        <PendingOperationLayout
          onClose={closeLoadingBox}
          burnState={burnState}
        />
      ) : (
        <BridgeRedeemLayout
          isBlurred={isBlurred}
          isButtonDisabled={isButtonDisabled}
          handleSubmit={handleSubmit}
        />
      )}
      {!isOperationPending && <ClaimTokensPopup />}
      <Tos />
    </div>
  );
}
