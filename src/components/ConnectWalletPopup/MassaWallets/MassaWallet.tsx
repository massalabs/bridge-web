import BearbyWallet from './BearbyWallet';
import useMassaProvider from './hooks/useMassaProvider';
import SelectMassaWallet from './SelectMassaWallet';
import StationWallet from './StationWallet';
import SwitchWalletButton from './SwitchWalletButton';
import { Connected } from '@/components';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

const MassaWallet = () => {
  const { selectProvider, resetProvider } = useMassaProvider();
  const { currentProvider, providers } = useAccountStore();

  if (!currentProvider)
    return (
      <SelectMassaWallet
        providerList={providers}
        onClick={(wallet) => selectProvider(wallet)}
      />
    );

  const renderWallet = () => {
    switch (currentProvider.name()) {
      case SUPPORTED_MASSA_WALLETS.MASSASTATION:
        return <StationWallet />;
      case SUPPORTED_MASSA_WALLETS.BEARBY:
        return <BearbyWallet />;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <SwitchWalletButton onClick={() => resetProvider()} />
        <Connected />
      </div>
      {renderWallet()}
    </>
  );
};

export default MassaWallet;
