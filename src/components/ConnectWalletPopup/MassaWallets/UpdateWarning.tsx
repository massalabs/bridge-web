import { Tooltip } from '@massalabs/react-ui-kit';
import { FiAlertTriangle } from 'react-icons/fi';
import Intl from '@/i18n/i18n';

export function UpdateMassaWalletWarning() {
  const body = (
    <>
      <p>{Intl.t('update-massa-wallet-warning.1')}</p>
      <p>{Intl.t('update-massa-wallet-warning.2')}</p>
      <p>{Intl.t('update-massa-wallet-warning.3')}</p>
    </>
  );

  // TODO: insert logic to check if user needs to update the wallet

  return (
    <div className="flex items-center">
      <Tooltip
        className="w-fit p-0 hover:cursor-pointer"
        customClass="p-0 mas-caption w-fit whitespace-nowrap"
        body={body}
      >
        <div className="flex items-center">
          <FiAlertTriangle className="text-s-warning" size={28} />
        </div>
      </Tooltip>
    </div>
  );
}
