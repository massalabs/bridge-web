import { Claim } from './Claim';
import { ILoadingBoxProps } from '../LoadingLayout';
import { loadingState } from '../LoadingState';
import { ShowOperationId } from '../ShowOperationId';
import Intl from '@/i18n/i18n';


export function RedeemLayout(props: ILoadingBoxProps) {
  const { loading, redeemSteps, setLoading, operationId, amount, decimals } =
    props;

  // wait for burn success --> than check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessfull = loading.burn === 'success';

  const claimArgs = {
    loading,
    redeemSteps,
    setLoading,
    operationId,
    amount,
    decimals,
  };

  return (
    <>
      {isBurnSuccessfull ? (
        <Claim {...claimArgs} />
      ) : (
        <>
          <div className="flex justify-between mb-6 ">
            <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
            {loadingState(loading.approve)}
          </div>
          <div className="flex justify-between mb-6 ">
            <p className="mas-body-2">{redeemSteps}</p>
            {loadingState(loading.burn)}
          </div>
        </>
      )}
      <ShowOperationId {...props} />
    </>
  );
}
