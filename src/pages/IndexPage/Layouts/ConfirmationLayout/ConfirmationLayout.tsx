import { Button } from '@massalabs/react-ui-kit';
import { FiArrowLeft } from 'react-icons/fi';
import { OperationDirection } from './OperationDirection';

import { OperationFees } from './OperationFees';
import { OperationInput } from './OperationInput';
import { OperationOutput } from './OperationOutput';
import { OperationTime } from './OperationTime';
import { Hr } from '@/components/Hr';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/operationStore';

interface ConfirmationLayoutProps {
  prevPage: () => void;
}

export function ConfirmationLayout(props: ConfirmationLayoutProps) {
  const { prevPage } = props;
  const { isMassaToEvm } = useOperationStore();
  const massaToEvm = isMassaToEvm();

  return (
    <>
      <div className="flex items-center mb-8">
        <Button
          customClass="absolute"
          onClick={() => prevPage()}
          variant={'icon'}
        >
          <FiArrowLeft />
        </Button>
        <div className="flex items-center w-full justify-center mas-h2">
          {massaToEvm
            ? Intl.t('confirmation.redeem')
            : Intl.t('confirmation.bridge')}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 mb-8">
        <OperationDirection />
        <Hr />
        <OperationInput />
        <OperationFees />
        <OperationOutput />
        <OperationTime />
      </div>
    </>
  );
}
