import Lottie from 'lottie-react';
import Intl from '@/i18n/i18n';
import animationData from '../../assets/lotties/loading.json';

export function Loading() {
  return (
    <div
      className="p-10 max-w-2xl h-[870px] w-full border border-tertiary
                rounded-2xl flex items-center justify-center bg-secondary/50 backdrop-blur-lg text-f-primary"
    >
      <div>
        <Lottie
          style={{ height: 300 }}
          animationData={animationData}
          loop={true}
        />
        <div className="text-center mas-title">
          <label>{Intl.t('index.approve.loading')}</label>
        </div>
      </div>
    </div>
  );
}

export function FetchingRound() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-s-success opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-s-success"></span>
    </span>
  );
}

export function FetchingLine() {
  return (
    <div className={`shadow rounded-md w-24 pt-1`}>
      <div className="animate-pulse flex">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-c-disabled-1 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function FetchingStatus() {
  return (
    <div className="bg-tertiary rounded-full w-fit px-3 pb-0.5 bg-tertiary opacity-30">
      {Intl.t('general.loading')}.
    </div>
  );
}
