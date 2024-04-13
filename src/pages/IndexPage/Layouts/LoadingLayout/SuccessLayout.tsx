import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { LoadingBoxProps } from './PendingOperationLayout';
import { ShowLinkToExplorers } from './ShowLinkToExplorers';
import { Blockchain } from '@/const';
import { addTokensBuildnetLink, addTokensMainnetLink } from '@/const/faq';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import Intl from '@/i18n/i18n';
import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { EVM_EXPLORER } from '@/utils/const';
import { formatAmountToDisplay } from '@/utils/parseAmount';
import { linkifyMassaOpIdToExplo } from '@/utils/utils';

export function SuccessLayout(props: LoadingBoxProps) {
  const { onClose } = props;
  const { isMassaToEvm, mintTxId, getCurrentRedeemOperation, amount } =
    useOperationStore();
  const { currentMode, isMainnet: getIsMainnet } = useBridgeModeStore();
  const { chain } = useAccount();
  const { evmNetwork: getEvmNetwork, massaNetwork: getMassaNetwork } =
    useBridgeModeStore();
  const evmWalletName = useConnectorName();
  const isMainnet = getIsMainnet();

  const evmNetwork = getEvmNetwork();
  const massaNetwork = getMassaNetwork();

  const { selectedToken: token } = useTokenStore();

  if (!chain || !token || !amount) return null;

  const massaToEvm = isMassaToEvm();
  const currentRedeemOperation = getCurrentRedeemOperation();
  const { amountFormattedPreview } = formatAmountToDisplay(
    amount,
    token.decimals,
  );

  const massaChainAndNetwork = `${Blockchain.MASSA} ${Intl.t(
    `general.${massaNetwork}`,
  )}`;

  const evmChainAndNetwork = `${chain.name} ${evmNetwork}`;

  // claim && bridge success need to show respective show link to explorer
  const explorerUrl = massaToEvm
    ? `${EVM_EXPLORER[currentMode]}tx/${currentRedeemOperation?.outputId}`
    : linkifyMassaOpIdToExplo(mintTxId as string);

  const emitter = massaToEvm ? massaChainAndNetwork : evmChainAndNetwork;
  const recipient = massaToEvm ? evmChainAndNetwork : massaChainAndNetwork;

  const currentTxID = massaToEvm ? currentRedeemOperation?.outputId : mintTxId;

  const redirectToFaq = getFaqUrl();

  function getFaqUrl(): string {
    if (isMainnet) {
      return addTokensMainnetLink;
    } else {
      return addTokensBuildnetLink;
    }
  }

  return (
    <div className="flex flex-col gap-6 mas-body2 text-center">
      <div className="mb-1 flex flex-col gap-2">
        {massaToEvm
          ? Intl.t('index.loading-box.redeemed')
          : Intl.t('index.loading-box.bridged')}
        <div className="mas-subtitle p-2">
          {amountFormattedPreview} {massaToEvm ? token.symbol : token.symbolEVM}
        </div>
        <div>
          {Intl.t('index.loading-box.from-to', {
            from: emitter,
            to: recipient,
          })}
        </div>
        <div>
          {Intl.t('index.loading-box.received-tokens', {
            amount: `${amountFormattedPreview} ${
              massaToEvm ? token.symbolEVM : token.symbol
            }`,
          })}
        </div>
      </div>
      <hr
        className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r 
        from-transparent via-tertiary to-transparent opacity-100"
      />
      <p className="mb-1">
        {Intl.t('index.loading-box.check', {
          name: massaToEvm
            ? evmWalletName
            : Intl.t('index.faq.mainnet.massa-wallet'),
        })}
      </p>
      {!massaToEvm && (
        <div>
          <div className="mb-1">
            {Intl.t('index.loading-box.add-tokens-message')}
          </div>
          <Link onClick={onClose} to={redirectToFaq}>
            <u>{Intl.t('index.loading-box.link-to-instructions')}</u>
          </Link>
        </div>
      )}
      <ShowLinkToExplorers
        explorerUrl={explorerUrl}
        currentTxID={currentTxID}
      />
    </div>
  );
}
