import { useEffect, useState } from 'react';

import { Clipboard } from '@massalabs/react-ui-kit';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { Unit, formatStandard, maskAddress } from '@/utils/massaFormat';

export function ConnectedAccount({
  account,
  // TODO: Remove this default value and use the network from the account
  // Remove if we don't want to display the network
  network = 'Buildnet',
}: {
  account: IAccount;
  network?: string;
}) {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  async function initBalance() {
    const balance = await account.balance();
    setBalance(balance);
  }

  useEffect(() => {
    initBalance();
  }, [account]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2">
        <div
          className="default-button flex min-h-12 items-center justify-center 
        px-4 default-secondary h-14 border-0 bg-secondary"
        >
          {network}
        </div>
        <Clipboard
          customClass="h-14 rounded-lg text-center !mas-body"
          rawContent={account?.address() ?? ''}
          displayedContent={maskAddress(account?.address() ?? '', 15)}
        />
      </div>
      <div className="mas-body">
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
        {formatStandard(Number(balance?.candidateBalance), Unit.MAS, 9)}
        {massaToken}
      </div>
    </div>
  );
}
