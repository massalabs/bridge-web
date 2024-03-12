import { Button } from '@massalabs/react-ui-kit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiEdit } from 'react-icons/fi';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { MetaMaskSvg } from '@/assets';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages/IndexPage/Layouts/LoadingLayout/FetchingComponent';
import { useBridgeModeStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';
import { isEvmNetworkValid } from '@/utils/networkValidation';
import { formatAmount } from '@/utils/parseAmount';

export function EvmConnectButton(): JSX.Element {
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const { switchChain } = useSwitchChain();

  const { address, chain } = useAccount();

  const { data: balanceData } = useBalance({
    address,
  });

  const isValidEVMNetwork = isEvmNetworkValid(isMainnet, chain?.id);

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

              if (!isValidEVMNetwork) {
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
