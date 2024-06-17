import { FiClock } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
export function OperationTime() {
  return (
    <div className="flex items-center w-full justify-between mas-body-2">
      <div className="flex items-center gap-2">
        {Intl.t('confirmation.transfer-time')} <FiClock />
      </div>
      <div>{Intl.t('confirmation.minutes')}</div>
    </div>
  );
}
