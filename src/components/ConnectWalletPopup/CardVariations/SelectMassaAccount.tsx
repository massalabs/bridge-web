import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { IAccount } from '@massalabs/wallet-provider';

import { BsDiamondHalf } from 'react-icons/bs';

export function SelectMassaWalletAccount({ ...props }) {
  const { accounts, account, setAccount } = props;

  const selectedAccountKey: number = parseInt(
    Object.keys(accounts).find(
      (_, idx) => accounts[idx].name() === account?.name(),
    ) || '0',
  );

  const iconsAccounts = {
    MASSASTATION: <MassaLogo />,
    OTHER: <BsDiamondHalf size={32} />,
  };

  return (
    <div className="flex flex-col gap-4">
      <Dropdown
        select={selectedAccountKey}
        options={accounts.map((account: IAccount) => {
          return {
            item: account.name(),
            icon: iconsAccounts['MASSASTATION'],
            onClick: () => setAccount(account),
          };
        })}
      />
    </div>
  );
}
