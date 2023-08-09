import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { IAccount } from '@massalabs/wallet-provider';
import { BsDiamondHalf } from 'react-icons/bs';

import { useAccountStore } from '@/store/store';

export function SelectMassaWalletAccount() {
  const [accounts, connectedAccount, setConnectedAccount] = useAccountStore(
    (state) => [
      state.accounts,
      state.connectedAccount,
      state.setConnectedAccount,
    ],
  );

  const selectedAccountKey: number = accounts.findIndex(
    (account) => account.name() === connectedAccount?.name(),
  );

  const iconsAccounts = {
    MASSASTATION: <MassaLogo />,
    OTHER: <BsDiamondHalf size={32} />,
  };

  return (
    <div className="min-w-[50%]">
      <Dropdown
        select={selectedAccountKey}
        options={accounts.map((account: IAccount) => {
          return {
            item: account.name(),
            icon: iconsAccounts['MASSASTATION'],
            onClick: () => setConnectedAccount(account),
          };
        })}
      />
    </div>
  );
}
