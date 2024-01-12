import { Tag } from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';

import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { MASSA_STATION_INSTALL } from '@/utils/const';

const InstructionBlock = ({
  type,
  title,
  description,
  link,
  linkKey,
}: {
  type: string;
  title: string;
  description: string;
  link: string;
  linkKey: string;
}) => (
  <div className="flex flex-col justify-center items-center gap-5">
    <Tag type={type} content={Intl.t(title)} />
    <p className="text-center mas-menu-default w-60">{Intl.t(description)}</p>
    <a
      className="mas-menu-underline"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {Intl.t(linkKey)}
    </a>
  </div>
);

export function ResourceSidePanel() {
  const { isConnected: isEvmWalletConnected } = useAccount();
  const [isStationInstalled] = useAccountStore((state) => [
    state.isStationInstalled,
  ]);

  const isOnlyMetamaskConnected = isEvmWalletConnected && !isStationInstalled;
  const isOnlyMassaWalletConnected =
    !isEvmWalletConnected && isStationInstalled;
  const isNeitherWalletConnected = !isStationInstalled && !isEvmWalletConnected;
  const isBothWalletConnected = isStationInstalled && isEvmWalletConnected;

  const renderInstructions = () => {
    if (isNeitherWalletConnected) {
      return (
        <>
          <InstructionBlock
            type="info"
            title="Add Testnet to Metamask"
            description="connect-wallet.ressource-sidepanel.add-sepolia"
            link="https://support.metamask.io/hc/en-us/articles/13946422437147-How-to-view-testnets-in-MetaMask"
            linkKey="general.instructions"
          />
          <div className="w-full border-t border-info/5" />
          <InstructionBlock
            title="Download Massa Station"
            type="success"
            description="connect-wallet.ressource-sidepanel.download-massa-station"
            link={MASSA_STATION_INSTALL}
            linkKey="general.download"
          />
        </>
      );
    }

    if (isOnlyMetamaskConnected) {
      return (
        <InstructionBlock
          title="Download Massa Station"
          type="success"
          description="connect-wallet.ressource-sidepanel.download-massa-station"
          link={MASSA_STATION_INSTALL}
          linkKey="general.download"
        />
      );
    }

    if (isOnlyMassaWalletConnected) {
      return (
        <InstructionBlock
          title="Add Testnet to Metamask"
          type="info"
          description="connect-wallet.ressource-sidepanel.add-sepolia"
          link="https://support.metamask.io/hc/en-us/articles/13946422437147-How-to-view-testnets-in-MetaMask"
          linkKey="general.instructions"
        />
      );
    }
  };

  return (
    !isBothWalletConnected && (
      <div
        className="row-span-2 col-start-3 row-start-1 h-full p-6 rounded-2xl 
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] 
        from-bright-blue to-deep-blue to-60% flex flex-col justify-center items-center gap-11"
      >
        {renderInstructions()}
      </div>
    )
  );
}
