import { maskAddress } from '@/utils/massaFormat';
import { SelectMassaWalletAccount } from '@/components';
import { Clipboard } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';

export function ConnectedCard({ ...props }) {
  const { account, balance } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full h-full">
        <SelectMassaWalletAccount {...props} />
        <Clipboard
          customClass="h-14 rounded-lg !mas-body"
          toggleHover={false}
          rawContent={account?.address().toString()}
          displayedContent={`${Intl.t(
            'connect-wallet.connected-cards.wallet-address',
          )}
            ${maskAddress(account?.address().toString())}`}
        />
      </div>
      <div>
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
        {Number(balance?.candidateBalance || 0)} MAS
      </div>
    </div>
  );
}
