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
