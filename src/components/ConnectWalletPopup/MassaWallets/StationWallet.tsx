import { ConnectedAccount } from './ConnectedAccount';
import { StationSelectAccount } from './StationSelectAccount';
import { useAccountStore } from '@/store/store';

export default function StationWallet() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="mas-body">
        {connectedAccount && (
          <div className="flex flex-col space-y-4 ">
            <StationSelectAccount />
            <ConnectedAccount />
          </div>
        )}
      </div>
    </div>
  );
}
