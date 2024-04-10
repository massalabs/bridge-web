import { SyntheticEvent } from 'react';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { validate } from '@/custom/bridge/handlers/validateTransaction';
import { useBurn } from '@/custom/bridge/useBurn';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';
import { BurnState } from '@/utils/const';

export function useSubmitRedeem() {
  const { setBox, setBurn } = useGlobalStatusesStore();
  const { amount } = useOperationStore();
  const { tokenBalance: tokenBalanceEVM } = useEvmToken();
  const { handleBurnRedeem } = useBurn();

  // TODO/: replace burn state by serverstate

  async function handleSubmitRedeem(e: SyntheticEvent) {
    console.log('handleSubmitRedeem');
    e.preventDefault();
    // validate amount to transact
    if (!validate(tokenBalanceEVM) || !amount) return;
    setBox(Status.Loading);
    setBurn(Status.Loading);
    const approved = await handleApproveRedeem(amount);
    if (approved) {
      console.log(BurnState.AWAITING_INCLUSION);
      await handleBurnRedeem();
      console.log(BurnState.PENDING);
    }
  }
  return { handleSubmitRedeem };
}
