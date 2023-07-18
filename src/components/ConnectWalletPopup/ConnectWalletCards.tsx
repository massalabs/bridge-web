import { useState } from 'react';
import metamask from '@/assets/metamask.svg';
import { ConnectMetamask } from './CardVariations/ConnectMetaMask';
import { SelectMassaWalletAccount } from './CardVariations/SelectMassaAccount';
import { RessourceSidePanel } from './CardVariations/RessourceSidePanel';
import { Tag } from '@massalabs/react-ui-kit';
import { ConnectedCard } from './CardVariations/ConnectedCard';
import { FiUser } from 'react-icons/fi';

export function ConnectWalletCards() {
  const [isMassaConnected, setIsMassaConnected] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

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

  const metamaskArgs = {
    setIsMetamaskConnected,
    src: metamask,
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

  return (
    <div className="pb-10 flex flex-row gap-4 text-f-primary">
      <div className="flex flex-col gap-4 min-w-[480px]">
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p>From: Sepolia testnet wallet </p>
            <Tag type="error" content="Not Connected" />
          </div>
          {isMetamaskConnected ? null : <ConnectMetamask {...metamaskArgs} />}
        </WalletCard>
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p>To: Massa testnet wallet </p>
            <Tag type="error" content="Not Connected" />
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
