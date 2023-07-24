import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@massalabs/react-ui-kit';
import { MetaMaskSvg } from '@/assets';
import Intl from '@/i18n/i18n';
import { FiEdit } from 'react-icons/fi';
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
            {/* TODO : Change img size after button rework */}
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} preIcon={<MetaMaskSvg />}>
                    {Intl.t('connect-wallet.connected-metamask.title')}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <>
                    <div>
                      {Intl.t(
                        'connect-wallet.connected-metamask.invalid-network',
                      )}
                    </div>
                    <Button onClick={openChainModal} type="button">
                      {Intl.t(
                        'connect-wallet.connected-metamask.change-network',
                      )}
                    </Button>
                  </>
                );
              }

              return (
                <>
                  <div className="flex w-full gap-3">
                    <Button
                      customClass="w-fit"
                      onClick={openChainModal}
                      type="button"
                    >
                      <div className="flex w-full gap-2">
                        {chain.hasIcon && (
                          <div>
                            {chain.iconUrl && (
                              <img
                                className="w-6 h-6"
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </div>
                    </Button>

                    {/* Can't use UI-Kit button here because it breaks the sepolia icon */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-secondary rounded-lg px-2 hover:bg-tertiary 
                      mas-body flex items-center w-fit justify-between gap-5"
                    >
                      {Intl.t('connect-wallet.connected-cards.wallet-address')}
                      {account.displayName}
                      <FiEdit size={18} />
                    </button>
                  </div>
                  <div>
                    {account.displayBalance
                      ? ` ${Intl.t(
                          'connect-wallet.connected-cards.wallet-balance',
                        )} ${account.balanceFormatted} ETH`
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
