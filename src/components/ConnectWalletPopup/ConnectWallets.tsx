import { useShowResourceSidePanel } from './ConnectWalletPopup';
import EvmWallet from './EvmWallets/EvmWallet';
import MassaWallet from './MassaWallets/MassaWallet';
import { ResourceSidePanel } from './ResourceSidePanel';

export function ConnectWallets() {
  const { showResourceSidePanel, showSepoliaInstruction } =
    useShowResourceSidePanel();

  const gridTemplateColumns = showResourceSidePanel ? '2fr 2fr 1fr' : '1fr 1fr';

  return (
    <div
      className="pb-10 text-f-primary grid grid-rows-2 gap-4"
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
          <ResourceSidePanel showSepoliaInstruction={showSepoliaInstruction} />
        </div>
      )}
    </div>
  );
}

export function WalletCard({ ...props }) {
  const { children } = props;

  return (
    <div className="bg-deep-blue p-6 rounded-2xl flex flex-col justify-center items-center">
      <div className="flex flex-col w-full mas-body">{children}</div>
    </div>
  );
}
