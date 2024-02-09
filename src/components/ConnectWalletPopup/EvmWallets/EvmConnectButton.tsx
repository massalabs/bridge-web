import { Button } from '@massalabs/react-ui-kit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiEdit } from 'react-icons/fi';
import { useSwitchChain } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

import { MetaMaskSvg } from '@/assets';
import { useWrongNetworkEVM } from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';
import { formatBalance } from '@/utils/utils';

export default function EvmConnectButton(): JSX.Element {
  const { wrongNetwork } = useWrongNetworkEVM();

  const { isMainnet } = useBridgeModeStore();
  const { switchChain } = useSwitchChain();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            className="flex flex-col gap-4"
            {...(!ready && {
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

              if (wrongNetwork) {
                return (
                  <>
                    <div>
                      {Intl.t(
                        'connect-wallet.connect-metamask.invalid-network',
                        { network: isMainnet ? 'Mainnet' : 'Sepolia' },
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      customClass="h-14"
                      onClick={() =>
                        switchChain?.({
                          chainId: isMainnet ? mainnet.id : sepolia.id,
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
                      {account.displayName}
                    </Button>
                  </div>
                  <div className="mas-body">
                    {account.displayBalance
                      ? `${Intl.t(
                          'connect-wallet.connected-cards.wallet-balance',
                        )} ${formatBalance(account.balanceFormatted)} ETH`
                      : ''}
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
