import { LoadingBoxProps } from './LoadingLayout';
import { loadingState } from './LoadingState';
import { ShowOperationId } from './ShowOperationId';
import Intl from '@/i18n/i18n';

export function BridgeLayout(props: LoadingBoxProps) {
  const { loading } = props;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
        {loadingState(loading.approve)}
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.lock')}</p>
        {loadingState(loading.lock)}
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.mint')}</p>
        {loadingState(loading.mint)}
      </div>
      <ShowOperationId {...props} />
    </div>
  );
}
