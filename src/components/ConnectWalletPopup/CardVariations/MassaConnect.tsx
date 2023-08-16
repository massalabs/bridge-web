import { useEffect, useState } from 'react';

import { Clipboard } from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { fetchBalance } from '@/bridge';
import { SelectMassaWalletAccount } from '@/components';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { Unit, formatStandard, maskAddress } from '@/utils/massaFormat';

export function ConnectedCard() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);

  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  useEffect(() => {
    fetchBalance(connectedAccount).then((balance) => setBalance(balance));
  }, [connectedAccount]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full h-full">
        <SelectMassaWalletAccount />
        <div className="min-w-[50%] pr-4">
          <Clipboard
            customClass="h-14 rounded-lg text-center px-9 !mas-body"
            toggleHover={false}
            rawContent={connectedAccount?.address() ?? ''}
            displayedContent={maskAddress(connectedAccount?.address() ?? '')}
          />
        </div>
      </div>
      <div className="mas-body">
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
        {formatStandard(
          Number(balance?.candidateBalance || 0),
          Unit.MAS,
          9,
        )}{' '}
        XMA
      </div>
    </div>
  );
}
