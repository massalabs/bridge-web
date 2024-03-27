import { numberOfCols } from './HistoryPage';
import Intl from '@/i18n/i18n';

export function Categories() {
  return (
    <ul
      className={`grid grid-cols-${numberOfCols} py-5 justify-center items-center mas-body`}
    >
      <li className="col-span-1 ">{Intl.t('history.from')}</li>
      <li className="col-span-1 ">{Intl.t('history.to')}</li>
      <li className="col-span-1 ">{Intl.t('history.time')}</li>
      <li className="col-span-1 ">{Intl.t('history.sent')}</li>
      <li className="col-span-1 ">{Intl.t('history.received')}</li>
      <li className="col-span-1 ">{Intl.t('history.status')}</li>
      <li className="col-span-1 ">{Intl.t('history.transaction-id')}</li>
    </ul>
  );
}
