import { useEffect, useState } from 'react';

import { fromMAS } from '@massalabs/massa-web3';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { fetchMASBalance } from '@/bridge';
import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { formatAmount } from '@/utils/parseAmount';

export function MASBalance() {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const { connectedAccount } = useAccountStore();

  useEffect(() => {
    if (!connectedAccount) return;
    fetchMASBalance(connectedAccount).then((balance) => {
      setBalance(balance);
    });
  }, [connectedAccount, setBalance]);

  const formattedBalance = formatAmount(
    fromMAS(balance?.candidateBalance || '0').toString(),
    9,
  ).full;

  return (
    <div className="mas-body">
      {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      {formattedBalance} {massaToken}
    </div>
  );
}
