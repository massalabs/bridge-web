import { useState } from 'react';
import BearbyWallet from './BearbyWallet';
import SelectMassaWallet from './SelectMassaWallet';
import StationWallet from './StationWallet';
import SwitchWalletButton from './SwitchWalletButton';
import { Connected, Disconnected } from '@/components';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

const MassaWallet = () => {
  const { currentProvider, providers, setCurrentProvider } = useAccountStore();

  // This state is used to check if Bearby is selected but not installed
  // in this case, currentProvider is undefined
  const [isBearbySelected, setBearbySelected] = useState(false);

  if (!currentProvider && !isBearbySelected)
    return (
      <SelectMassaWallet
        providerList={providers}
        onClick={(provider) => {
          setBearbySelected(provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY);
          setCurrentProvider(provider);
        }}
      />
    );
  const renderWallet = () => {
    if (isBearbySelected) {
      return <BearbyWallet />;
    }
    switch (currentProvider?.name()) {
      case SUPPORTED_MASSA_WALLETS.MASSASTATION:
        return <StationWallet />;
      case SUPPORTED_MASSA_WALLETS.BEARBY:
        return <BearbyWallet />;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <SwitchWalletButton
          onClick={() => {
            setBearbySelected(false);
            setCurrentProvider();
          }}
        />
        {currentProvider ? <Connected /> : <Disconnected />}
      </div>
      {renderWallet()}
    </>
  );
};

export default MassaWallet;
