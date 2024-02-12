import { Button } from '@massalabs/react-ui-kit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiEdit } from 'react-icons/fi';
import { formatUnits } from 'viem';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

import { MetaMaskSvg } from '@/assets';
import { useWrongNetworkEVM } from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';
import { formatAmount } from '@/utils/parseAmount';

export default function EvmConnectButton(): JSX.Element {
  const { wrongNetwork } = useWrongNetworkEVM();

  const { isMainnet } = useBridgeModeStore();
  const { switchChain } = useSwitchChain();

  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
  });

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
                    {balanceData
                      ? `${Intl.t(
                          'connect-wallet.connected-cards.wallet-balance',
                        )} ${formatAmount(
                          balanceData.value.toString(), balanceData.decimals,
                        ).full} ${balanceData.symbol}`
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
