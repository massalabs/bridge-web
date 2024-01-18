import { useState } from 'react';
import { MassaLogo } from '@massalabs/react-ui-kit';
import BearbyWallet from './BearbyWallet';
import SelectMassaWallet from './SelectMassaWallet';
import StationWallet from './StationWallet';
import SwitchWalletButton from './SwitchWalletButton';
import { BearbySvg } from '@/assets/BearbySvg';
import { Connected, Disconnected } from '@/components';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

const MassaWallet = () => {
  const {
    connectedAccount,
    currentProvider,
    providers,
    setCurrentProvider,
    isFetching,
  } = useAccountStore();

  const [selectedProvider, setSelectedProvider] = useState<
    SUPPORTED_MASSA_WALLETS | undefined
  >(undefined);

  if (!selectedProvider || isFetching)
    return (
      <SelectMassaWallet
        onClick={(providerName) => {
          setSelectedProvider(providerName);
          const provider = providers.find((p) => p.name() === providerName);
          if (provider) {
            setCurrentProvider(provider);
          }
        }}
      />
    );
  const renderWallet = () => {
    switch (selectedProvider) {
      case SUPPORTED_MASSA_WALLETS.MASSASTATION:
        return <StationWallet />;
      case SUPPORTED_MASSA_WALLETS.BEARBY:
        return <BearbyWallet />;
    }
  };

  const renderSelectedWallet = () => {
    switch (selectedProvider) {
      case SUPPORTED_MASSA_WALLETS.MASSASTATION:
        // TODO: change it to Massa Wallet Plugin logo
        return (
          <>
            <MassaLogo size={28} />
            {SUPPORTED_MASSA_WALLETS.MASSASTATION}
          </>
        );
      case SUPPORTED_MASSA_WALLETS.BEARBY:
        // TODO: check if we need to update Bearby logo
        return (
          <>
            <BearbySvg />
            {SUPPORTED_MASSA_WALLETS.BEARBY}
          </>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center mb-4">
          {renderSelectedWallet()}
          {currentProvider && connectedAccount ? (
            <Connected />
          ) : (
            <Disconnected />
          )}
        </div>
        <SwitchWalletButton
          onClick={() => {
            setSelectedProvider(undefined);
            setCurrentProvider();
          }}
        />
      </div>
      {renderWallet()}
    </>
  );
};

export default MassaWallet;
