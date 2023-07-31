import {
  PopupModal,
  PopupModalHeader,
  PopupModalContent,
  Tag,
} from '@massalabs/react-ui-kit';

import { WETH, ETH, TDAI } from './Tokens';
import { GradientCard } from '@/components';
import { LayoutType } from '@/const';
import Intl from '@/i18n/i18n';

export interface IErrorsMap {
  [key: string]: string;
}

export const ErrorsMap: IErrorsMap = {
  TransactionExecutionError: Intl.t('get-tokens.errors.transaction-execution'),
  General: Intl.t('get-tokens.errors.general'),
};

interface GetTokensModalProps {
  setOpenModal: (open: boolean) => void;
  layout: LayoutType | undefined;
}

function MassaToEVMContent() {
  return (
    <div className="flex items-start justify-center gap-5 mt-5 mb-10">
      <GradientCard customClass="w-72 h-80">
        <Tag
          type="error"
          content={Intl.t(`get-tokens.tag.XMA`)}
          customClass="m-5"
        />
        <p className="mas-menu-default text-center m-5">
          {Intl.t(`get-tokens.card.XMA-description`)}
        </p>
        <p className="mas-menu-underline m-5 cursor-pointer">
          {Intl.t(`get-tokens.card.link`)}
        </p>
      </GradientCard>
    </div>
  );
}

export function GetTokensPopUpModal(props: GetTokensModalProps) {
  const { setOpenModal, layout } = props;

  return (
    <PopupModal
      fullMode={true}
      onClose={() => setOpenModal(false)}
      customClass="max-w-5xl"
      customClassNested="border border-tertiary bg-secondary/50 backdrop-blur-lg"
    >
      <PopupModalHeader>
        <h1 className="mas-title mb-4 text-f-primary">
          {Intl.t('get-tokens.title', {
            token:
              layout === 'evmToMassa' ? 'Sepolia Testnet' : 'Massa Buildnet',
          })}
        </h1>
      </PopupModalHeader>
      <PopupModalContent>
        {layout === 'evmToMassa' ? (
          <div className="flex items-start justify-center gap-5 mt-5 mb-10">
            <TDAI />
            <WETH />
            <ETH />
          </div>
        ) : (
          <MassaToEVMContent />
        )}
      </PopupModalContent>
    </PopupModal>
  );
}
