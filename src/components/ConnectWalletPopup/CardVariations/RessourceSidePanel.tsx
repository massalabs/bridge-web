import { Tag } from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';

import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { linkToCreateWallet } from '@/utils/const';

function SepoliaInstructions() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Tag type="info" content="Add Sepolia testnet" />
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.ressource-sidepanel.add-sepolia')}
      </p>
      <a className="mas-menu-underline" href="www.mylink.com" target="_blank">
        {Intl.t('general.instructions')}
      </a>
    </div>
  );
}

function MassaStationInstructions() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Tag type="success" content="Create a Massa Wallet" />
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.ressource-sidepanel.download-massa-station')}
      </p>
      <a className="mas-menu-underline" href="www.mylink.com" target="_blank">
        {Intl.t('general.download')}
      </a>
    </div>
  );
}

export function RessourceSidePanel() {
  const { isConnected: isEvmWalletConnected } = useAccount();

  const [accounts, isStationInstalled] = useAccountStore((state) => [
    state.accounts,
    state.isStationInstalled,
  ]);

  const isOnlyMetamaskConnected =
    isEvmWalletConnected && !isStationInstalled && accounts.length === 0;
  const isOnlyMassaConnected =
    isStationInstalled && !isEvmWalletConnected && accounts.length > 0;

  return (
    <div
      className={`
        h-full p-6 rounded-2xl
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-bright-blue to-deep-blue to-60%
        flex flex-col justify-center items-center gap-11`}
    >
      {isOnlyMetamaskConnected ? (
        <MassaStationInstructions />
      ) : isOnlyMassaConnected ? (
        <SepoliaInstructions />
      ) : (
        <>
          <div className="flex flex-col justify-center items-center gap-5">
            <Tag type="info" content="Add Sepolia testnet" />
            <p className="text-center mas-menu-default w-60">
              {Intl.t('connect-wallet.ressource-sidepanel.add-sepolia')}
            </p>
            <a
              className="mas-menu-underline"
              href="www.mylink.com"
              target="_blank"
            >
              {Intl.t('general.click-here')}
            </a>
          </div>
          <div className="w-full border-t border-info/5" />
          <div className="flex flex-col justify-center items-center gap-5">
            <Tag type="success" content="Create a Massa Wallet" />
            <p className="text-center mas-menu-default w-56">
              {Intl.t('connect-wallet.ressource-sidepanel.add-massa')}
            </p>
            <a
              className="mas-menu-underline"
              href={linkToCreateWallet}
              target="_blank"
            >
              {Intl.t('general.click-here')}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
