import { useAccount as useEvmAccount } from 'wagmi';

import ConnectEvmWallet from './ConnectEvmWallet';
import ConnectMassaWallet from './ConnectMassaWallet';
import { ResourceSidePanel } from '@/components';
import { useAccountStore } from '@/store/store';

export function ConnectWallets() {
  const { isConnected: isEvmWalletConnected } = useEvmAccount();
  const [isMassaWalletInstalled] = useAccountStore((state) => [
    state.accounts,
    state.isStationInstalled,
  ]);

  const isNeitherConnected = !isEvmWalletConnected && !isMassaWalletInstalled;

  const gridColsTemplate = isNeitherConnected ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div
      className={`pb-10 text-f-primary grid ${gridColsTemplate} grid-rows-2 gap-4`}
    >
      <div className="col-span-2">
        <WalletCard>
          <ConnectEvmWallet />
        </WalletCard>
      </div>
      <div className="col-span-2 col-start-1 row-start-2">
        <WalletCard>
          <ConnectMassaWallet />
        </WalletCard>
      </div>
      <ResourceSidePanel />
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
