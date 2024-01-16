import { useEffect, useState } from 'react';

import { Clipboard } from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { fetchBalance } from '@/bridge';
import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { Unit, formatStandard, maskAddress } from '@/utils/massaFormat';

export function ConnectedAccount() {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);

  // TODO: Remove this default value and use the network from the account
  // Remove if we don't want to display the network
  const network = 'Buildnet';

  async function initBalance() {
    const balance = await fetchBalance(connectedAccount);
    setBalance(balance);
  }

  useEffect(() => {
    initBalance();
  }, [connectedAccount]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4">
        <div
          className="default-button flex min-h-12 items-center justify-center 
        px-4 default-secondary h-14 border-0 bg-secondary"
        >
          {network}
        </div>
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
