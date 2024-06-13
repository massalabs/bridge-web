import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';

import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useGlobalStatusesStore,
  useOperationStore,
} from '@/store/store';

export function IndexPage() {
  const { box } = useGlobalStatusesStore();
  const { connectedAccount, isFetching } = useAccountStore();

  const { isMassaToEvm, inputAmount } = useOperationStore();

  const massaToEvm = isMassaToEvm();
  const isValidEvmNetwork = useEvmChainValidation(ChainContext.BRIDGE);
  const isValidMassaNetwork = useMassaNetworkValidation();

  const isOperationPending = box !== Status.None;
  const blurClass = isOperationPending ? 'blur-md' : '';

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    !isValidEvmNetwork ||
    !inputAmount ||
    !isValidMassaNetwork ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full">
      <BridgeRedeemLayout
        isBlurred={blurClass}
        isButtonDisabled={isButtonDisabled}
      />
      {!isOperationPending && <ClaimTokensPopup />}
    </div>
  );
}
