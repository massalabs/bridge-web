import { useEffect, useState } from 'react';

import {
  SelectMassaWalletAccount,
  RessourceSidePanel,
  ConnectedCard,
  MetamaskNotInstalled,
} from '@/components';

import { Tag } from '@massalabs/react-ui-kit';
import { FiUser } from 'react-icons/fi';
import { useAccount } from 'wagmi';
// import { ConnectButton as ConnectEvmButton } from '@rainbow-me/rainbowkit';

import Intl from '@/i18n/i18n';
import { tagTypes } from '@/utils/const';
import { CustomConnectButton } from './CardVariations/CustomConnectBtn';

export function ConnectWalletCards() {
  const { isConnected: isEvmWalletConnected } = useAccount();
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(
    window.ethereum.isConnected(),
  );
  const [isMassaConnected, setIsMassaConnected] = useState(false);
  const [massaTagType, setMassaTagType] = useState<string>(tagTypes.error);
  const [metamaskTagType, setMetamaskTagType] = useState<string>(
    tagTypes.error,
  );
  // Massa Account selection options
  // Simulates the options that would be returned from the Massa Web 3 fetches
  // Todo, we have to know how to get the account that is selected in the options

  const options = [
    {
      item: 'Account 1',
      icon: (
        <div className="w-4">
          <FiUser />
        </div>
      ),
    },
    {
      item: 'Account 2',
      icon: (
        <div className="w-4">
          <FiUser />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isMassaConnected) {
      setMassaTagType(tagTypes.success);
    } else {
      setMassaTagType(tagTypes.error);
    }
  }, [isMassaConnected]);

  useEffect(() => {
    if (isEvmWalletConnected) {
      setMetamaskTagType(tagTypes.success);
    } else {
      setMetamaskTagType(tagTypes.error);
    }
  }, [isEvmWalletConnected]);

  // The idea would be to have a map of the accounts and reuse them for the selector

  const walletArgs = {
    walletAddress: '0x1234567890123456789012345678901234567890',
    walletName: 'Alice',
    icon: <FiUser size={24} />,
    setIsMassaConnected,
  };

  const massaWalletArgs = {
    options,
    setIsMassaConnected,
  };

  // Wallet card wrapper component

  function WalletCard({ ...props }) {
    const { children } = props;

    return (
      <div
        className="bg-primary w-full h-60 p-6 
                    rounded-2xl
                    flex flex-col justify-center items-center"
      >
        <div className="flex flex-col w-full mas-body">{children}</div>
      </div>
    );
  }

  // Checks to see if metamask is installed
  useEffect(() => {
    setIsMetamaskInstalled(window.ethereum.isConnected());
  }, [isMetamaskInstalled]);

  return (
    <div className="pb-10 flex flex-row gap-4 text-f-primary">
      <div className="flex flex-col gap-4 min-w-[480px]">
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p> {Intl.t('connect-wallet.card-destination.from')} </p>
            <Tag
              type={metamaskTagType}
              content={
                isEvmWalletConnected
                  ? Intl.t('index.tag.connected')
                  : Intl.t('index.tag.not-connected')
              }
            />
          </div>
          {/* <ConnectEvmButton /> */}
          {isMetamaskInstalled ? (
            <CustomConnectButton />
          ) : (
            <MetamaskNotInstalled />
          )}
        </WalletCard>
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p>{Intl.t('connect-wallet.card-destination.to')}</p>
            <Tag
              type={massaTagType}
              content={
                isMassaConnected
                  ? Intl.t('index.tag.connected')
                  : Intl.t('index.tag.not-connected')
              }
            />
          </div>
          {isMassaConnected ? (
            <ConnectedCard {...walletArgs} />
          ) : (
            <SelectMassaWalletAccount {...massaWalletArgs} />
          )}
        </WalletCard>
      </div>
      <RessourceSidePanel />
    </div>
  );
}
