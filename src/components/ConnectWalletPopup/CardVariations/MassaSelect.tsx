import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { IAccount } from '@massalabs/wallet-provider';

import { BearbySvg } from '@/assets/BearbySvg';
import { useAccountStore, useWalletStore } from '@/store/store';

interface WalletIcon {
  [key: string]: JSX.Element;
}

export function SelectMassaWalletAccount() {
  const [accounts, connectedAccount, setConnectedAccount, isFetching] =
    useAccountStore((state) => [
      state.accounts,
      state.connectedAccount,
      state.setConnectedAccount,
      state.isFetching,
    ]);

  const [isMassaWallet] = useWalletStore((state) => [state.isMassaWallet]);

  const selectedAccountKey: number = accounts.findIndex(
    (account) => account.name() === connectedAccount?.name(),
  );

  const iconsWallets: WalletIcon = {
    MASSASTATION: <MassaLogo />,
    BEARBY: <BearbySvg />,
  };

  return (
    <div className="min-w-[50%]">
      <Dropdown
        readOnly={!isMassaWallet || isFetching}
        select={selectedAccountKey}
        options={accounts.map((account: IAccount) => {
          return {
            item: account.name(),
            icon: iconsWallets[account.name().toUpperCase()],
            onClick: () => setConnectedAccount(account),
          };
        })}
      />
    </div>
  );
}
