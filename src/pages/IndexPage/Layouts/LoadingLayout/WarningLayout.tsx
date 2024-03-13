import { ShowLinkToExplorers } from './ShowLinkToExplorers';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/store';

export function WarningLayout() {
  const { isMassaToEvm } = useOperationStore();
  const massaToEvm = isMassaToEvm();

  const currentTxID = undefined;

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
      {/* Link will be updated at a later stage because this component needs to be changed  */}
      <ShowLinkToExplorers explorerUrl="foo" currentTxID={currentTxID} />
    </div>
  );
}
