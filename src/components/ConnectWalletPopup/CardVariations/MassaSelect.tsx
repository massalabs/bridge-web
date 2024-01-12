import { ClientFactory } from '@massalabs/massa-web3';
import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { IAccount, providers } from '@massalabs/wallet-provider';
import { BsDiamondHalf } from 'react-icons/bs';

import { useAccountStore } from '@/store/store';

export function SelectMassaWalletAccount() {
  const [accounts, connectedAccount, setConnectedAccount, setMassaClient] =
    useAccountStore((state) => [
      state.accounts,
      state.connectedAccount,
      state.setConnectedAccount,
      state.setMassaClient,
    ]);

  const selectedAccountKey: number = accounts.findIndex(
    (account) => account.name() === connectedAccount?.name(),
  );

  const iconsAccounts = {
    MASSASTATION: <MassaLogo />,
    OTHER: <BsDiamondHalf size={32} />,
  };

  const onAccountChange = async (account: IAccount) => {
    setConnectedAccount(account);

    // Temporary put the logic here...
    const providerList = await providers();

    if (!providerList.length) {
      setConnectedAccount(undefined);
      setMassaClient(undefined);
      return;
    }

    setMassaClient(
      await ClientFactory.fromWalletProvider(
        // if we want to support multiple providers like bearby, we need to pass the selected one here
        providerList[0],
        account,
      ),
    );
  };

  return (
    <div className="min-w-[50%]">
      <Dropdown
        select={selectedAccountKey}
        options={accounts.map((account: IAccount) => {
          return {
            item: account.name(),
            icon: iconsAccounts['MASSASTATION'],
            onClick: () => onAccountChange(account),
          };
        })}
      />
    </div>
  );
}
