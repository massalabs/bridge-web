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
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} preIcon={<MetaMaskSvg />}>
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
                  <div className="flex w-full gap-3 justify-around">
                    <Button
                      onClick={openChainModal}
                      preIcon={
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                        />
                      }
                    >
                      {chain.name}
                    </Button>

                    <Button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-secondary rounded-lg px-2 hover:bg-tertiary 
                      mas-body flex items-center justify-between gap-5 min-w-fit"
                      posIcon={<FiEdit size={14} />}
                    >
                      <div className="flex justify-between w-full">
                        {Intl.t(
                          'connect-wallet.connected-cards.wallet-address',
                        )}
                        {account.displayName}
                      </div>
                    </Button>
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
