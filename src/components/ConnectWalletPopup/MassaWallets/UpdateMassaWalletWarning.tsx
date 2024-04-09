import { Tooltip } from '@massalabs/react-ui-kit';
import { FiAlertTriangle } from 'react-icons/fi';
import * as Semver from 'semver';
import { useResource } from '@/custom/api/useResource';
import { useIsMassaWalletCurrentProvider } from '@/custom/bridge/useIsMassaWalletCurrentProvider';
import Intl from '@/i18n/i18n';
import { MASSA_STATION_PLUGIN } from '@/utils/const';

type PluginInfo = {
  author: string;
  description: string;
  home: string;
  name: string;
  status: string;
  version: string;
};

const MASSA_STATION_PLUGIN_NAME = 'Massa Wallet';
const MASSA_STATION_PLUGIN_VERSION = '0.3.3';

export function UpdateMassaWalletWarning(props: { customClass?: string }) {
  const isMassaWalletCurrentProvider = useIsMassaWalletCurrentProvider();

  const { data } = useResource<PluginInfo[]>(
    MASSA_STATION_PLUGIN,
    isMassaWalletCurrentProvider,
  );

  const version = data?.find(
    (plugin) => plugin.name === MASSA_STATION_PLUGIN_NAME,
  )?.version;

  if (version === undefined) return null;

  const displayUpdateWarning = Semver.lt(version, MASSA_STATION_PLUGIN_VERSION);

  const body = (
    <>
      <p>{Intl.t('update-massa-wallet-warning.1')}</p>
      <p>{Intl.t('update-massa-wallet-warning.2')}</p>
      <p>{Intl.t('update-massa-wallet-warning.3')}</p>
    </>
  );

  if (!displayUpdateWarning || !isMassaWalletCurrentProvider) return null;

  return (
    <div className={`flex items-center ${props.customClass}`}>
      <Tooltip
        className="w-fit p-0 hover:cursor-pointer"
        customClass="p-0 mas-caption w-fit whitespace-nowrap"
        body={body}
      >
        <div className="flex items-center">
          <FiAlertTriangle className="text-s-warning" size={28} />
        </div>
      </Tooltip>
    </div>
  );
}
