import { Button, formatAmount } from '@massalabs/react-ui-kit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiEdit } from 'react-icons/fi';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { MetaMaskSvg } from '@/assets';
import {
  useEvmChainValidation,
  useGetChainValidationContext,
} from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages/IndexPage/Layouts/LoadingLayout/FetchingComponent';
import { maskAddress } from '@/utils/massaFormat';

export function EvmConnectButton(): JSX.Element {
  const { switchChain } = useSwitchChain();

  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
  });

  const { targetChainId, context } = useGetChainValidationContext();

  const isValidEVMNetwork = useEvmChainValidation(context);

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
                          chainId: targetChainId,
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
