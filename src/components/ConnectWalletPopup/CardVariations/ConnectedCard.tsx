import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';
import { SelectMassaWalletAccount } from '@/components';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';

export function ConnectedCard({ ...props }) {
  const { account } = props;
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  async function fetchBalance(account: IAccount | null) {
    try {
      return await account?.balance();
    } catch (error) {
      console.error('Error while retrieving balance: ', error);
    }
  }

  useEffect(() => {
    fetchBalance(account).then((balance) => setBalance(balance));
  }, [account]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 w-full h-full">
        <SelectMassaWalletAccount {...props} />
        <button
          type="button"
          onClick={() => copy(account?.address().toString())}
          className="bg-secondary rounded-lg px-2 hover:bg-tertiary 
                      mas-body flex items-center w-fit h-full justify-between gap-5"
        >
          {Intl.t('connect-wallet.connected-cards.wallet-address')}
          {maskAddress(account?.address().toString())}
          <FiCopy size={18} />
        </button>
      </div>
      <div>
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
        {Number(balance?.candidateBalance || 0)} MAS
      </div>
    </div>
  );
}
