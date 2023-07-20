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
                    Connect to MetaMask
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <>
                    <div>
                      Your network is invalid, please change it to Sepolia
                      testnet
                    </div>
                    <Button onClick={openChainModal} type="button">
                      Change your network
                    </Button>
                  </>
                );
              }

              return (
                <>
                  <div className="flex min-w-fit gap-3">
                    <Button
                      customClass="w-fit"
                      onClick={openChainModal}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div>
                          {chain.iconUrl && (
                            <img
                              className="w-6 h-6 min-w-fit"
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              // style={{ width: 24, height: 24 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    {/* Can't use UI-Kit button here because it breaks the sepolia icon */}
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-secondary rounded-lg px-2 hover:bg-tertiary 
                      mas-body flex items-center w-full justify-between"
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
                        )} ${account.displayBalance}`
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
