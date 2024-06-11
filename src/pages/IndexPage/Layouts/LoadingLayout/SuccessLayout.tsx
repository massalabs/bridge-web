import { formatStandard } from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { BridgeLinkExplorer } from './BridgeLinkExplorer';
import { addTokensBuildnetLink, addTokensMainnetLink } from '@/const/faq';
import { useBridgeUtils } from '@/custom/bridge/useBridgeUtils';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import Intl from '@/i18n/i18n';
import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function SuccessLayout() {
  const { isMassaToEvm, mintTxId, getCurrentRedeemOperation, outputAmount } =
    useOperationStore();
  const { isMainnet: getIsMainnet, massaNetwork: getMassaNetwork } =
    useBridgeModeStore();
  const { chain } = useAccount();
  const evmWalletName = useConnectorName();
  const isMainnet = getIsMainnet();
  const { closeLoadingBox } = useBridgeUtils();
  const massaNetwork = getMassaNetwork();

  const { selectedToken: token } = useTokenStore();

  if (!chain || !token || !outputAmount) return null;

  const massaToEvm = isMassaToEvm();
  const currentRedeemOperation = getCurrentRedeemOperation();
  const amountFormatted = formatStandard(
    parseUnits(outputAmount, token.decimals).toString(),
    token.decimals,
  );

  const massaChainAndNetwork = `${Intl.t('general.Massa')} ${Intl.t(
    `general.${massaNetwork}`,
  )}`;

  const evmChainAndNetwork = chain.name;

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
          {amountFormatted} {massaToEvm ? token.symbol : token.symbolEVM}
        </div>
        <div>
          {Intl.t('index.loading-box.from-to', {
            from: emitter,
            to: recipient,
          })}
        </div>
        <div>
          {Intl.t('index.loading-box.received-tokens', {
            amount: `${amountFormatted} ${
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
          <Link onClick={closeLoadingBox} to={redirectToFaq}>
            <u>{Intl.t('index.loading-box.link-to-instructions')}</u>
          </Link>
        </div>
      )}
      <BridgeLinkExplorer currentTxID={currentTxID} />
    </div>
  );
}
