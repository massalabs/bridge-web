import { useMemo } from 'react';
import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { IProvider } from '@massalabs/wallet-provider';
import { BearbySvg } from '@/assets/BearbySvg';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import Intl from '@/i18n/i18n';

const walletList = [
  {
    name: SUPPORTED_MASSA_WALLETS.MASSASTATION,
    icon: <MassaLogo size={32} />,
  },
  {
    name: SUPPORTED_MASSA_WALLETS.BEARBY,
    icon: <BearbySvg />,
  },
];

interface SelectMassaWalletProps {
  providerList: IProvider[];
  onClick: (wallet: SUPPORTED_MASSA_WALLETS) => void;
}

const SelectMassaWallet = ({
  providerList,
  onClick,
}: SelectMassaWalletProps) => {
  const noWalletFound = providerList.length === 0;

  // TODO - Check if this useMemo is still necessary
  const walletOptions = useMemo(() => {
    return walletList.map((provider) => ({
      item: provider.name,
      icon: provider.icon,
      onClick: () => onClick(provider.name),
    }));
  }, [providerList, noWalletFound]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="mas-body flex-col justify-center">
          {Intl.t('connect-wallet.card-destination.select-wallet')}
        </p>
      </div>
      <div className="w-full">
        <Dropdown select={0} options={walletOptions} />
      </div>
    </>
  );
};

export default SelectMassaWallet;
