import BearbyWallet from './BearbyWallet';
import useMassaProvider from './hooks/useMassaProvider';
import SelectMassaWallet from './SelectMassaWallet';
import StationWallet from './StationWallet';
import SwitchWalletButton from './SwitchWalletButton';
import { Connected } from '@/components';
import { SUPPORTED_MASSA_WALLETS } from '@/const';

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
        <Connected />
      </div>
      {renderWallet()}
    </>
  );
};

export default MassaWallet;
