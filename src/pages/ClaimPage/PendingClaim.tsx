import { useContractEvent } from 'wagmi';

import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { Spinner } from '@/components';
import { EVM_BRIDGE_ADDRESS } from '@/const';
import Intl from '@/i18n/i18n';

interface PendingClaim {
  onRedeemSuccess: (state: `0x${string}` | null) => void;
  inputOpId: string;
}

export function PendingClaim(args: PendingClaim) {
  const { onRedeemSuccess, inputOpId } = args;
  const stopListening = useContractEvent({
    address: EVM_BRIDGE_ADDRESS,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener(logs) {
      const event = logs.find(
        (log) => (log as any).args.burnOpId === inputOpId,
      );
      if (event) {
        onRedeemSuccess(event.transactionHash);
        stopListening?.();
      }
    },
  });
  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary 
          mas-menu-active rounded-2xl px-10 py-14 text-menu-active"
    >
      <p>{Intl.t('claim.pending')}</p>
      <Spinner size="md" />
    </div>
  );
}
