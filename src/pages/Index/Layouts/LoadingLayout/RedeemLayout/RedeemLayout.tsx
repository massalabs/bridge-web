import { Claim } from './ClaimRedeem';
import { LoadingState } from '../LoadingState';
import { ShowLinkToExplorers } from '../ShowLinkToExplorers';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import {
  MASSA_EXPLO_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLORER_URL,
} from '@/utils/const';

export function RedeemLayout() {
  const { burn, approve, claim, redeemLabels } = useGlobalStatusesStore();
  const { burnTxId } = useOperationStore();
  const { isMainnet } = useBridgeModeStore();

  // wait for burn success --> then check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessful = burn === Status.Success;

  const buildnetExplorerUrl = `${MASSA_EXPLO_URL}${burnTxId}${MASSA_EXPLO_EXTENSION}`;
  const mainnetExplorerUrl = `${MASSA_EXPLORER_URL}${burnTxId}`;
  const explorerUrl = isMainnet ? mainnetExplorerUrl : buildnetExplorerUrl;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
          <LoadingState state={approve} />
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">
            {' '}
            {Intl.t('index.loading-box.burn-step', {
              state: redeemLabels.burn ? redeemLabels.burn : '',
            })}
          </p>
          <LoadingState state={burn} />
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">
            {Intl.t('index.loading-box.claim-step', {
              state: redeemLabels.claim ? redeemLabels.claim : '',
            })}
          </p>
          <LoadingState state={claim} />
        </div>
        {isBurnSuccessful && <Claim />}
        <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={burnTxId} />
      </div>
    </>
  );
}
