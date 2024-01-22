import { Dropdown, MassaLogo } from '@massalabs/react-ui-kit';
import { BearbySvg } from '@/assets/BearbySvg';
import { Disconnected } from '@/components';
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
  onClick: (providerName: SUPPORTED_MASSA_WALLETS) => void;
}

const SelectMassaWallet = ({ onClick }: SelectMassaWalletProps) => {
  const walletOptions = () => {
    return walletList.map((provider) => ({
      item: provider.name,
      icon: provider.icon,
      onClick: () => onClick(provider.name),
    }));
  };

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body flex-col justify-center">
          {Intl.t('connect-wallet.card-destination.to')}
        </p>
        <Disconnected />
      </div>
      <div className="w-full">
        <Dropdown
          options={walletOptions()}
          defaultItem={{
            item: Intl.t('connect-wallet.card-destination.select-wallet'),
          }}
        />
      </div>
    </>
  );
};

export default SelectMassaWallet;
