import { ConnectedAccount } from './ConnectedAccount';
import { StationSelectAccount } from './StationSelectAccount';
import { useAccountStore } from '@/store/store';

export default function StationWallet() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);

  console.log(connectedAccount);

  return (
    <div className="flex flex-col gap-4">
      <div className="mas-body">
        {connectedAccount ? (
          <div className="flex flex-col space-y-4 ">
            <StationSelectAccount />
            <ConnectedAccount />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 ">
            No wallet accounts found in MassaWallet
            <a
              // TODO: Put the right link
              href="https://docs.massa.net/docs/massaStation/massa-wallet/getting-started"
              target="_blank"
              rel="noreferrer"
              className="text-f-primary underline"
            >
              Create an account
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
