import { FiChevronLeft } from 'react-icons/fi';

import Intl from '@/i18n/i18n';

export default function SwitchWalletButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex flex-row just items-center hover:cursor-pointer gap-2 w-fit"
    >
      <FiChevronLeft />
      <p>{Intl.t('connect-wallet.card-destination.switch')}</p>
    </div>
  );
}
