import { Tag } from '@massalabs/react-ui-kit';

import Intl from '@/i18n/i18n';
import { MASSA_STATION_INSTALL } from '@/utils/const';

function SepoliaInstructions() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <Tag type="info">Add Sepolia testnet</Tag>
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.resource-sidepanel.add-sepolia')}
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
      <Tag type="success">{Intl.t('connect-wallet.download-massa')}</Tag>
      <p className="text-center mas-menu-default w-60">
        {Intl.t('connect-wallet.resource-sidepanel.download-massa-station')}
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

export function ResourceSidePanel({
  showSepoliaInstruction,
  showStationDownload,
}: {
  showSepoliaInstruction: boolean;
  showStationDownload: boolean;
}) {
  return (
    <div
      className={`
        h-full p-6 rounded-2xl
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-bright-blue to-deep-blue to-60%
        flex flex-col justify-center items-center gap-11`}
    >
      {showSepoliaInstruction && <SepoliaInstructions />}
      {showStationDownload && <MassaStationDownload />}
    </div>
  );
}
