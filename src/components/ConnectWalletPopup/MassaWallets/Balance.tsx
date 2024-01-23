import { useEffect, useState } from 'react';

import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { fetchMASBalance } from '@/bridge';
import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { Unit, formatStandard } from '@/utils/massaFormat';

export function Balance() {
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
    <div className="mas-body">
      {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      {formatStandard(Number(balance?.candidateBalance), Unit.MAS, 9)}
      {massaToken}
    </div>
  );
}
