import { SyntheticEvent } from 'react';
import { useAccount } from 'wagmi';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { handleBurnRedeem } from '@/custom/bridge/handlers/handleBurnRedeem';
import { validate } from '@/custom/bridge/handlers/validateTransaction';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function useSubmitRedeem() {
  const { selectedToken } = useTokenStore();

  const { setBox } = useGlobalStatusesStore();
  const { amount } = useOperationStore();
  const { address: evmAddress } = useAccount();
  const { tokenBalance: tokenBalanceEVM } = useEvmToken();

  const { massaClient } = useAccountStore();

  // TODO/: replace burn state by serverstate

  async function handleSubmitRedeem(e: SyntheticEvent) {
    console.log('handleSubmitRedeem');
    e.preventDefault();
    // validate amount to transact
    if (!validate(tokenBalanceEVM) || !amount || !selectedToken) return;
    setBox(Status.Loading);

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
        // setBurnState,
      });
    }
  }
  return { handleSubmitRedeem };
}
