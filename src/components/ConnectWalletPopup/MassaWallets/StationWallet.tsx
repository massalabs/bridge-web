import { ConnectedAccount } from './ConnectedAccount';
import { StationSelectAccount } from './StationSelectAccount';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export default function StationWallet() {
  const { accounts, providers } = useAccountStore();
  const isProviderAvailable = providers.find(
    (provider) => provider.name() === SUPPORTED_MASSA_WALLETS.MASSASTATION,
  );

  if (!isProviderAvailable) {
    // TODO: Put the right Error message
    return <div>No provider found ERROR</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mas-body">
        {accounts.length > 0 ? (
          <div className="flex flex-col space-y-4 ">
            <StationSelectAccount />
            <ConnectedAccount />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 ">
            {/* TODO: Traduction */}
            Install wallet and create account
            <a
              // TODO: Put the right link
              href="https://docs.massa.net/docs/massaStation/massa-wallet/getting-started"
              target="_blank"
              rel="noreferrer"
              className="text-f-primary underline"
            >
              {/* TODO: Traduction */}
              Create an account
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
