import {
  PopupModal,
  PopupModalHeader,
  PopupModalContent,
  Tag,
  toast,
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

export function handleErrorMessage(error: string) {
  const ERRORS_MESSAGES = ['User rejected the request'];

  const regex = new RegExp(ERRORS_MESSAGES.join('|'), 'i');

  if (regex.test(error)) {
    return;
  } else {
    toast.error(Intl.t('get-tokens.errors.general'));
  }
}

function MassaToEVMContent() {
  return (
    <div className="flex items-start justify-center gap-5 mt-5 mb-10">
      <GradientCard customClass="w-72 h-80">
        <Tag type="error" customClass="m-5">
          {Intl.t('get-tokens.tag.MAS')}
        </Tag>
        <p className="mas-menu-default text-center m-5">
          {Intl.t(`get-tokens.card.MAS-description`)}
        </p>
        <a
          href="https://discord.gg/FS2NVAum"
          target="_blank"
          className="mas-menu-underline mb-4 cursor-pointer"
        >
          {Intl.t(`get-tokens.card.link`)}
        </a>
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
