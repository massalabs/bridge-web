import { Tag, Tooltip } from '@massalabs/react-ui-kit';

import { FiHelpCircle } from 'react-icons/fi';
import { Blockchain, SUPPORTED_MASSA_WALLETS } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { tagTypes } from '@/utils/const';

interface WrongChainProps {
  blockchain: Blockchain;
}

export function WrongChain(props: WrongChainProps) {
  const { blockchain } = props;
  const { currentProvider } = useAccountStore();
  const { isMainnet } = useBridgeModeStore();

  let body = '';
  if (blockchain === Blockchain.MASSA && currentProvider) {
    // currentProvider is always defined when blockchain is MASSA
    const providerName = currentProvider.name();

    const targetNetwork = isMainnet()
      ? Blockchain.MASSA_MAINNET
      : Blockchain.MASSA_BUILDNET;

    if (providerName === SUPPORTED_MASSA_WALLETS.MASSASTATION) {
      body = Intl.t('index.tag.wrong-chain-massa-station-tooltip', {
        network: Intl.t(`general.${targetNetwork}`),
      });
    } else if (
      blockchain === Blockchain.MASSA &&
      providerName === SUPPORTED_MASSA_WALLETS.BEARBY
    ) {
      body = Intl.t('index.tag.wrong-chain-bearby-tooltip', {
        network: Intl.t(`general.${targetNetwork}`),
      });
    }
  } else {
    body = Intl.t('connect-wallet.connect-metamask.invalid-network');
  }

  return (
    <Tag type={tagTypes.warning}>
      <div className="flex items-center">
        <Tooltip
          className="w-fit p-0 hover:cursor-pointer"
          customClass="p-0 mas-caption w-fit whitespace-nowrap"
          body={body}
        >
          <div className="flex items-center">
            <span className="mr-1">{Intl.t('index.tag.wrong-chain')}</span>
            <FiHelpCircle className="text-s-warning" />
          </div>
        </Tooltip>
      </div>
    </Tag>
  );
}
