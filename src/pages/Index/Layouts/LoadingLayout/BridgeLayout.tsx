import { LoadingState } from './LoadingState';
import { ShowOperationId } from './ShowOperationId';
import Intl from '@/i18n/i18n';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';

export function BridgeLayout() {
  const { approve, lock, mint } = useGlobalStatusesStore();

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
      <ShowOperationId />
    </div>
  );
}
