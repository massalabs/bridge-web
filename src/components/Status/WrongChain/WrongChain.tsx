import { Tag, Tooltip } from '@massalabs/react-ui-kit';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { tagTypes } from '@/utils/const';

interface WrongChainProps {
  isMassaChain: boolean;
}

export function WrongChain(props: WrongChainProps) {
  const { isMassaChain } = props;
  const { currentProvider } = useAccountStore();
  const { massaNetwork } = useBridgeModeStore();

  const currentMassaNetwork = massaNetwork();

  let body = '';
  if (isMassaChain && currentProvider) {
    // currentProvider is always defined when blockchain is MASSA
    const providerName = currentProvider.name();

    if (providerName === SUPPORTED_MASSA_WALLETS.MASSASTATION) {
      body = Intl.t('index.tag.wrong-chain-massa-station-tooltip', {
        network: Intl.t(`general.${currentMassaNetwork}`),
      });
    } else if (
      isMassaChain &&
      providerName === SUPPORTED_MASSA_WALLETS.BEARBY
    ) {
      body = Intl.t('index.tag.wrong-chain-bearby-tooltip', {
        network: Intl.t(`general.${currentMassaNetwork}`),
      });
    }
  } else {
    body = Intl.t('connect-wallet.connect-metamask.invalid-network');
  }

  return (
    <Tag type={tagTypes.warning}>
      <div className="flex gap-2 items-center">
        {Intl.t('index.tag.wrong-chain')}
        <Tooltip customIconColor="text-s-warning" body={body} />
      </div>
    </Tag>
  );
}
