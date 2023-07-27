import { maskAddress } from '@/utils/massaFormat';
import { SelectMassaWalletAccount } from '@/components';
import { Clipboard } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';
import { useEffect, useState } from 'react';
import { fetchBalance } from '@/bridge';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

export function ConnectedCard({ ...props }) {
  const { account } = props;

  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  useEffect(() => {
    fetchBalance(account).then((balance) => setBalance(balance));
  }, [account]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full h-full">
        <SelectMassaWalletAccount {...props} />
        <div className="min-w-[50%] pr-4">
          <Clipboard
            customClass="h-14 rounded-lg text-center px-9 !mas-body"
            toggleHover={false}
            rawContent={account?.address().toString()}
            displayedContent={maskAddress(account?.address().toString())}
          />
        </div>
      </div>
      <div className="mas-body">
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
        {balance?.candidateBalance || 0} MAS
      </div>
    </div>
  );
}
