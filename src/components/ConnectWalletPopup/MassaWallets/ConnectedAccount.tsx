import { useEffect, useState } from 'react';

import { Clipboard } from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { fetchMASBalance } from '@/bridge';
import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { Unit, formatStandard, maskAddress } from '@/utils/massaFormat';

export function ConnectedAccount() {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const { connectedAccount } = useAccountStore();

  async function initBalance() {
    if (!connectedAccount) return;
    const balance = await fetchMASBalance(connectedAccount);
    setBalance(balance);
  }

  useEffect(() => {
    initBalance();
  }, [connectedAccount]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4">
        <Clipboard
          customClass="h-14 rounded-lg text-center !mas-body"
          rawContent={connectedAccount?.address() ?? ''}
          displayedContent={maskAddress(connectedAccount?.address() ?? '', 15)}
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
