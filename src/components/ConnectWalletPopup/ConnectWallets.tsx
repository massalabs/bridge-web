import { useAccount as useEvmAccount } from 'wagmi';

import EvmWallet from './EvmWallets/EvmWallet';
import MassaWallet from './MassaWallets/MassaWallet';
import { ResourceSidePanel } from './ResourceSidePanel';
import { useAccountStore } from '@/store/store';

export function ConnectWallets() {
  const { isConnected: isEvmWalletConnected } = useEvmAccount();
  const [providerList] = useAccountStore((state) => [state.providers]);

  const showSepoliaInstruction = !isEvmWalletConnected;
  const showStationDownload = !providerList.find(
    (provider) => provider.name() === 'MASSASTATION',
  );

  // TODO: Do we want to display the resource side panel if Bearby is installed?
  const showResourceSidePanel = showSepoliaInstruction || showStationDownload;

  const gridTemplateColumns = showResourceSidePanel ? '2fr 2fr 1fr' : '1fr 1fr';

  return (
    <div
      className={`pb-10 text-f-primary grid grid-rows-2 gap-4`}
      style={{ gridTemplateColumns }}
    >
      <div className="col-span-2">
        <WalletCard>
          <EvmWallet />
        </WalletCard>
      </div>
      <div className="col-span-2">
        <WalletCard>
          <MassaWallet />
        </WalletCard>
      </div>
      {showResourceSidePanel && (
        <div className="row-span-2 col-start-3 row-start-1">
          <ResourceSidePanel
            showSepoliaInstruction={showSepoliaInstruction}
            showStationDownload={showStationDownload}
          />
        </div>
      )}
    </div>
  );
}

export function WalletCard({ ...props }) {
  const { children } = props;

  return (
    <div className="bg-deep-blue h-60 p-6 rounded-2xl flex flex-col justify-center items-center">
      <div className="flex flex-col w-full mas-body">{children}</div>
    </div>
  );
}
