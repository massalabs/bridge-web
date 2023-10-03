import { Tag } from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';

import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { MASSA_STATION_INSTALL, MASSA_STATION_URL } from '@/utils/const';

function SepoliaInstructions() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Tag type="info" content="Add Sepolia testnet" />
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.ressource-sidepanel.add-sepolia')}
      </p>
      <a
        className="mas-menu-underline"
        href="https://support.metamask.io/hc/en-us/articles/13946422437147-How-to-view-testnets-in-MetaMask"
        target="_blank"
      >
        {Intl.t('general.instructions')}
      </a>
    </div>
  );
}

function MassaStationDownload() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Tag type="success" content={Intl.t('connect-wallet.download-massa')} />
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.ressource-sidepanel.download-massa-station')}
      </p>
      <a
        className="mas-menu-underline"
        href={MASSA_STATION_INSTALL}
        target="_blank"
      >
        {Intl.t('general.download')}
      </a>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function MassaStationInstructions() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Tag type="success" content={Intl.t('connect-wallet.create-wallet')} />
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.ressource-sidepanel.create-massa-station')}
      </p>
      <a
        className="mas-menu-underline"
        href={MASSA_STATION_URL}
        target="_blank"
      >
        {Intl.t('general.click-here')}
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

  const isOnlyMetamaskConnected = isEvmWalletConnected && !isStationInstalled;
  const isBothNotConnected = !isStationInstalled && !isEvmWalletConnected;

  return (
    <div
      className={`
        h-full p-6 rounded-2xl
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-bright-blue to-deep-blue to-60%
        flex flex-col justify-center items-center gap-11`}
    >
      {isBothNotConnected ? (
        <>
          <SepoliaInstructions />
          <div className="w-full border-t border-info/5" />
          <MassaStationDownload />
        </>
      ) : isOnlyMetamaskConnected && accounts ? (
        <MassaStationDownload />
      ) : (
        <SepoliaInstructions />
      )}
    </div>
  );
}
