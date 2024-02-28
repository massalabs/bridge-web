import Intl from '@/i18n/i18n';

export function Categories() {
  return (
    <ul className="grid grid-cols-6 py-5 justify-center items-center mas-body  ">
      <li className="col-span-1 ">{Intl.t('history.from')}</li>
      <li className="col-span-1 ">{Intl.t('history.to')}</li>
      <li className="col-span-1 ">{Intl.t('history.time')}</li>
      <li className="col-span-1 ">{Intl.t('history.amount')}</li>
      <li className="col-span-1 ">{Intl.t('history.status')}</li>
      <li className="col-span-1 ">{Intl.t('history.transaction-id')}</li>
    </ul>
  );
}
