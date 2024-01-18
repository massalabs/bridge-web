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
  onClick: (provider: IProvider) => void;
}

const SelectMassaWallet = ({
  providerList,
  onClick,
}: SelectMassaWalletProps) => {
  // TODO - Check if this useMemo is still necessary
  const walletOptions = useMemo(() => {
    return walletList
      .filter((wallet) => providerList.some((p) => p.name() === wallet.name))
      .map((provider) => ({
        item: provider.name,
        icon: provider.icon,
        onClick: () =>
          onClick(providerList.find((p) => p.name() === provider.name)!),
      }));
  }, [providerList]);

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
