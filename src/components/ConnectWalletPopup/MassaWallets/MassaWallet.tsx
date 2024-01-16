import BearbyWallet from './BearbyWallet';
import useMassaProvider from './hooks/useMassaProvider';
import SelectMassaWallet from './SelectMassaWallet';
import StationWallet from './StationWallet';
import SwitchWalletButton from './SwitchWalletButton';
import { Connected, Disconnected } from '@/components';

export enum SUPPORTED_MASSA_WALLETS {
  MASSASTATION = 'MASSASTATION',
  BEARBY = 'BEARBY',
}

const MassaWallet = () => {
  const { providerList, currentProvider, selectProvider, resetProvider } =
    useMassaProvider();

  if (!currentProvider)
    return (
      <SelectMassaWallet
        providerList={providerList}
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
        <p className="">
          <SwitchWalletButton onClick={() => resetProvider()} />
        </p>
        {currentProvider ? <Connected /> : <Disconnected />}
      </div>
      {renderWallet()}
    </>
  );
};

export default MassaWallet;
