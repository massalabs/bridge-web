import Intl from '@/i18n/i18n';
import { IAccount } from '@massalabs/wallet-provider';

import { toast } from '@massalabs/react-ui-kit';

export async function fetchBalance(account: IAccount | null) {
  try {
    return await account?.balance();
  } catch (error) {
    console.error('Error while retrieving balance: ', error);
    toast.error(Intl.t(`index.balance.error`));
  }
}
