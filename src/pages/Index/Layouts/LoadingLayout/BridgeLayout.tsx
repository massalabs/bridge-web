import { LoadingState } from './LoadingState';
import { ShowLinkToExplorers } from './ShowOperationId';
import Intl from '@/i18n/i18n';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import { EVM_EXPLORER } from '@/utils/const';

export function BridgeLayout() {
  const { approve, lock, mint } = useGlobalStatusesStore();
  const { currentMode } = useBridgeModeStore();
  const { currentTxID } = useOperationStore();

  // Bridge side exporer url to etherscan or testnet/etherscan
  // Will always be present as we can access links on both modes
  const explorerUrl = EVM_EXPLORER[currentMode] + 'tx/' + currentTxID;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
        <LoadingState state={approve} />
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.lock')}</p>
        <LoadingState state={lock} />
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.mint')}</p>
        <LoadingState state={mint} />
      </div>
      <ShowLinkToExplorers explorerUrl={explorerUrl} />
    </div>
  );
}
