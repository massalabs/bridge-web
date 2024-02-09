import { useWatchContractEvent } from 'wagmi';
import { ClaimState } from './ClaimButton';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { Spinner } from '@/components';
import { config } from '@/const';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

interface PendingClaimProps {
  onStateChange: (state: ClaimState, txHash?: `0x${string}` | null) => void;
  inputOpId: string;
}

export function PendingClaim(props: PendingClaimProps) {
  const { onStateChange, inputOpId } = props;
  const { currentMode } = useBridgeModeStore();

  useWatchContractEvent({
    address: config[currentMode].evmBridgeContract,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    onLogs(logs) {
      const event = logs.find(
        (log) => (log as any).args.burnOpId === inputOpId,
      );
      if (event) {
        onStateChange(ClaimState.SUCCESS, event.transactionHash);
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
