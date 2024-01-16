import { useMemo } from 'react';

import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { IProvider } from '@massalabs/wallet-provider';

import { BearbySvg } from '@/assets/BearbySvg';
import { Disconnected } from '@/components';
import Intl from '@/i18n/i18n';

interface WalletIcon {
  [key: string]: JSX.Element;
}

const iconsWallets: WalletIcon = {
  MASSASTATION: <MassaLogo size={32} />,
  BEARBY: <BearbySvg />,
};

interface SelectMassaWalletProps {
  providerList: IProvider[];
  onClick: (wallet: IProvider) => void;
}

const SelectMassaWallet = ({
  providerList,
  onClick,
}: SelectMassaWalletProps) => {
  const noWalletFound = providerList.length === 0;

  // TODO - Check if this useMemo is still necessary
  const walletOptions = useMemo(() => {
    if (noWalletFound) {
      return [{ item: Intl.t('connect-wallet.card-destination.no-wallets') }];
    }

    return providerList.map((provider) => ({
      item: provider.name(),
      icon: iconsWallets[provider.name().toUpperCase()],
      onClick: () => onClick(provider),
    }));
  }, [providerList, noWalletFound]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="mas-body flex-col justify-center">
          {Intl.t('connect-wallet.card-destination.select-wallet')}
        </p>
        <Disconnected />
      </div>
      <div className="w-full">
        <Dropdown readOnly={noWalletFound} select={0} options={walletOptions} />
      </div>
    </>
  );
};

export default SelectMassaWallet;
