import { ShowLinkToExplorers } from './ShowOperationId';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/store';
import { SIDE } from '@/utils/const';

export function WarningLayout() {
  const { side } = useOperationStore();
  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  return (
    <div className="text-center">
      <p>{Intl.t('index.loading-box.warning-description')}</p>
      <p>
        {Intl.t('index.loading-box.warning-expect', {
          wallet: massaToEvm ? 'Metamask' : 'Massa Wallet',
        })}
      </p>
      <p className="mas-menu font-bold">
        {Intl.t('index.loading-box.warning-time')}
      </p>
      <p>{Intl.t('index.loading-box.warning-contact')}</p>
      <u className="mb-2">
        <a href="mailto:support.bridge@massa.net" target="_blank">
          support.bridge@massa.net
        </a>
      </u>
      <ShowLinkToExplorers explorerUrl="foo" />
    </div>
  );
}
