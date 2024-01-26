import EvmWallet from './EvmWallets/EvmWallet';
import MassaWallet from './MassaWallets/MassaWallet';

export function ConnectWallets() {
  return (
    <div className="pb-10 text-f-primary grid grid-rows-2 gap-4">
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
