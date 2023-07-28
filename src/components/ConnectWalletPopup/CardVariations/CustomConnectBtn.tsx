import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@massalabs/react-ui-kit';
import { MetaMaskSvg } from '@/assets';
import Intl from '@/i18n/i18n';
import { FiEdit } from 'react-icons/fi';
import { BsDiamondHalf } from 'react-icons/bs';
import { formatBalance } from '@/utils/utils';

export function CustomConnectButton(): JSX.Element {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
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
                    customClass="h-14 pt-4"
                    onClick={openConnectModal}
                    preIcon={<MetaMaskSvg />}
                  >
                    {Intl.t(
                      'connect-wallet.connect-metamask.connect-to-metamask',
                    )}
                  </Button>
                );
              }

              if (chain.unsupported) {
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
                      onClick={openChainModal}
                    >
                      {Intl.t('connect-wallet.connect-metamask.change-network')}
                    </Button>
                  </>
                );
              }

              return (
                <>
                  <div className="flex w-full gap-4">
                    <div className="min-w-[50%]">
                      <Button
                        variant="secondary"
                        customClass="h-14 pt-4 border-0 bg-secondary hover:bg-tertiary"
                        onClick={openChainModal}
                        preIcon={<BsDiamondHalf size={40} />}
                      >
                        {chain.name}
                      </Button>
                    </div>
                    <div className="min-w-[50%] pr-4">
                      <Button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-secondary rounded-lg hover:bg-tertiary h-14
                       gap-5 w-full"
                        posIcon={<FiEdit size={14} />}
                      >
                        {account.displayName}&nbsp;&nbsp;&nbsp;
                      </Button>
                    </div>
                  </div>
                  <div className="mas-body">
                    {account.displayBalance
                      ? ` ${Intl.t(
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
