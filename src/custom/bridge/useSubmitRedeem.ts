import { useCallback } from 'react';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { validate } from '@/custom/bridge/handlers/validateTransaction';
import { useBurn } from '@/custom/bridge/useBurn';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';
import { BurnState } from '@/utils/const';

export function useSubmitRedeem() {
  const { setBox, setBurn, setClaim } = useGlobalStatusesStore();
  const { inputAmount: amount, setBurnState } = useOperationStore();
  const { tokenBalance: tokenBalanceEVM } = useEvmToken();
  const { handleBurnRedeem } = useBurn();

  const handleSubmitRedeem = useCallback(async () => {
    // validate amount to transact
    if (!validate(tokenBalanceEVM) || !amount) return;
    setClaim(Status.None);
    setBox(Status.Loading);
    const approved = await handleApproveRedeem(amount);
    if (approved) {
      setBurn(Status.Loading);
      setBurnState(BurnState.AWAITING_INCLUSION);
      await handleBurnRedeem();
    }
  }, [
    amount,
    tokenBalanceEVM,
    setBox,
    setBurn,
    setBurnState,
    setClaim,
    handleBurnRedeem,
  ]);
  return { handleSubmitRedeem };
}
