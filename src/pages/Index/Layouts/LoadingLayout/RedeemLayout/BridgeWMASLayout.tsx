import { LoadingState } from '../LoadingState';
import { ShowLinkToExplorers } from '../ShowLinkToExplorers';
import Intl from '@/i18n/i18n';
import {
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
} from '@/store/store';
import {
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLO_URL,
} from '@/utils/const';

export function BridgeWMASLayout() {
  const { burnWMAS, claim } = useGlobalStatusesStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const { burnTxId } = useOperationStore();

  const buildnetExplorerUrl = `${MASSA_EXPLO_URL}${burnTxId}${MASSA_EXPLO_EXTENSION}`;
  const mainnetExplorerUrl = `${MASSA_EXPLORER_URL}${burnTxId}`;
  const explorerUrl = isMainnet ? mainnetExplorerUrl : buildnetExplorerUrl;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="mas-body-2">
            {Intl.t('index.loading-box.burn-wmas-label', {
              state: 'todo',
            })}
          </p>
          <LoadingState state={burnWMAS} />
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">
            {Intl.t('index.loading-box.redeem-wmas-label', {
              state: 'todo',
            })}
          </p>
          <LoadingState state={claim} />
        </div>
        <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={burnTxId} />
      </div>
    </>
  );
}
