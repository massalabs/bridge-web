import { Button } from '@massalabs/react-ui-kit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiEdit } from 'react-icons/fi';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';

import { MetaMaskSvg } from '@/assets';
import {
  useWrongNetworkBsc,
  useWrongNetworkEVM,
} from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages/Index/Layouts/LoadingLayout/FetchingComponent';
import { useBridgeModeStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';
import { formatAmount } from '@/utils/parseAmount';

export default function EvmConnectButton(): JSX.Element {
  const { wrongNetwork: wrongNetworkEvm } = useWrongNetworkEVM();
  const { wrongNetwork: wrongNetworkBsc } = useWrongNetworkBsc();

  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const { switchChain } = useSwitchChain();

  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
  });

  function getChainToSwitch() {
    if (isMainnet) {
      if (wrongNetworkEvm) {
        return mainnet.id;
      }
      return bsc.id;
    } else {
      if (wrongNetworkEvm) {
        return sepolia.id;
      }
      return bscTestnet.id;
    }
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <div
            className="flex flex-col gap-4"
            {...(!mounted && {
              'aria-hidden': true,
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="secondary"
                    customClass="h-14"
                    onClick={openConnectModal}
                    preIcon={<MetaMaskSvg />}
                  >
                    {Intl.t(
                      'connect-wallet.connect-metamask.connect-to-metamask',
                    )}
                  </Button>
                );
              }

              if (wrongNetworkEvm || wrongNetworkBsc) {
                return (
                  <>
                    <div>
                      {Intl.t(
                        'connect-wallet.connect-metamask.invalid-network',
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      customClass="h-14"
                      onClick={() =>
                        switchChain?.({
                          chainId: getChainToSwitch(),
                        })
                      }
                    >
                      {Intl.t('connect-wallet.connect-metamask.switch-network')}
                    </Button>
                  </>
                );
              }

              return (
                <>
                  <div className="flex w-full gap-4">
                    <Button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-secondary rounded-lg hover:bg-tertiary h-14 gap-5 w-full"
                      posIcon={<FiEdit size={14} />}
                    >
                      {maskAddress(account.address)}
                    </Button>
                  </div>
                  <div className="flex gap-2 mas-body">
                    {Intl.t('connect-wallet.connected-cards.wallet-balance')}
                    {balanceData ? (
                      `${
                        formatAmount(
                          balanceData.value.toString(),
                          balanceData.decimals,
                        ).amountFormattedFull
                      } ${balanceData.symbol}`
                    ) : (
                      <FetchingLine />
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
