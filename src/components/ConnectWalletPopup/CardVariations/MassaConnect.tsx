import { useEffect, useState } from 'react';

import { Clipboard } from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { fetchBalance } from '@/bridge';
import { SelectMassaWalletAccount } from '@/components';
import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { Unit, formatStandard, maskAddress } from '@/utils/massaFormat';

export function MassaConnect() {
  const [connectedAccount, getConnectedAddress] = useAccountStore((state) => [
    state.connectedAccount,
    state.getConnectedAddress,
  ]);

  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const massaAddress = getConnectedAddress();

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
            rawContent={massaAddress || ''}
            displayedContent={maskAddress(massaAddress || '')}
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
        {massaToken}
      </div>
    </div>
  );
}
