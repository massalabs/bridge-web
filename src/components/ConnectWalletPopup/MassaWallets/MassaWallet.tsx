import { useState } from 'react';
import {
  MassaWallet as MassaWalletLogo,
  Tooltip,
} from '@massalabs/react-ui-kit';
import BearbyWallet from './BearbyWallet';
import SelectMassaWallet from './SelectMassaWallet';
import StationWallet from './StationWallet';
import SwitchWalletButton from './SwitchWalletButton';
import { BearbySvg } from '@/assets/BearbySvg';
import { Connected, Disconnected, WrongChain } from '@/components';
import { MASSA, SUPPORTED_MASSA_WALLETS } from '@/const';
import { useWrongNetworkMASSA } from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';
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
  >(currentProvider?.name() as SUPPORTED_MASSA_WALLETS);

  const { wrongNetwork } = useWrongNetworkMASSA();

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
      default:
        // Should not happen
        return <>Error: no wallet selected</>;
    }
  };

  const renderSelectedWallet = () => {
    switch (selectedProvider) {
      case SUPPORTED_MASSA_WALLETS.MASSASTATION:
        return (
          <>
            <MassaWalletLogo size={28} />
            {Intl.t(`connect-wallet.${SUPPORTED_MASSA_WALLETS.MASSASTATION}`)}
          </>
        );
      case SUPPORTED_MASSA_WALLETS.BEARBY:
        return (
          <>
            <BearbySvg />
            {Intl.t(`connect-wallet.${SUPPORTED_MASSA_WALLETS.BEARBY}`)}
          </>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          {renderSelectedWallet()}
          {connectedAccount ? (
            wrongNetwork ? (
              <WrongChain blockchain={MASSA} />
            ) : (
              <Connected />
            )
          ) : (
            <Disconnected />
          )}
          {selectedProvider === SUPPORTED_MASSA_WALLETS.BEARBY && (
            <Tooltip
              customClass="mas-caption w-fit whitespace-nowrap"
              content={Intl.t(
                'connect-wallet.card-destination.non-massa-wallet',
              )}
            />
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
