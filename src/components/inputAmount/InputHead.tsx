import { Dropdown, FetchingLine, IOption } from '@massalabs/react-ui-kit';
import { UpdateMassaWalletWarning } from '../ConnectWalletPopup/MassaWallets/UpdateMassaWalletWarning';
import { ChainStatus } from '../Status/ChainStatus';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import { ChainContext } from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';

interface InputHeadProps {
  address: string | undefined;
  context: ChainContext;
  dropdownOptions: IOption[];
  isMassaChain: boolean;
  isConnected: boolean;
  select: number | undefined;
}

export function InputHead(props: InputHeadProps) {
  const {
    address,
    context,
    dropdownOptions,
    isMassaChain,
    isConnected,
    select,
  } = props;

  const { currentProvider } = useAccountStore();

  const walletName = useConnectorName();
  const isReadyOnly = dropdownOptions.length <= 1;

  return (
    <div className="flex w-full justify-between py-4">
      <div className="flex flex-col items-start gap-2 mas-body2">
        {!address ? <FetchingLine /> : maskAddress(address as string)}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 mas-body">
            <UpdateMassaWalletWarning customClass="mr-3" />
            {isMassaChain ? (
              <>
                {isConnected && currentProvider
                  ? Intl.t(`connect-wallet.${currentProvider.name()}`)
                  : Intl.t('connect-wallet.card-destination.to')}
              </>
            ) : (
              <>
                {isConnected
                  ? walletName
                  : Intl.t('connect-wallet.card-destination.from')}
              </>
            )}
          </div>
          <ChainStatus context={context} isMassaChain={isMassaChain} />
        </div>
      </div>
      <div className="w-1/2">
        <Dropdown
          readOnly={isReadyOnly}
          options={dropdownOptions}
          select={select}
        />
      </div>
    </div>
  );
}
