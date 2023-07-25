import Intl from '@/i18n/i18n';
import { LayoutType } from '@/const';

import { GradientCard } from '@/components';
import {
  PopupModal,
  PopupModalHeader,
  PopupModalContent,
  Tag,
} from '@massalabs/react-ui-kit';

interface GetTokensModalProps {
  setOpenModal: (open: boolean) => void;
  layout: LayoutType | undefined;
}

function EVMToMassaContent() {
  return (
    <div className="flex items-start justify-center gap-5 mt-5 mb-10">
      <GradientCard customClass="w-72 h-80">
        <Tag
          type="warning"
          content={Intl.t(`get-tokens.tag.tDAI`)}
          customClass="mb-4"
        />
        <p className="mas-menu-default text-center mb-4">
          {Intl.t(`get-tokens.card.tDAI-description`)}
        </p>
        <p className="mas-menu-underline mb-4 cursor-pointer">
          {Intl.t(`get-tokens.card.mint`, { token: 'tDAI' })}
        </p>
        <p className="mas-menu-underline mb-4 cursor-pointer">
          {Intl.t(`get-tokens.card.link`)}
        </p>
      </GradientCard>
      <GradientCard customClass="w-72 h-80">
        <Tag
          type="default"
          content={Intl.t(`get-tokens.tag.WETH`)}
          customClass="mb-4"
        />
        <p className="mas-menu-default text-center mb-4">
          {Intl.t(`get-tokens.card.WETH-description`)}
        </p>
        <p className="mas-menu-underline mb-4 cursor-pointer">
          {Intl.t(`get-tokens.card.mint`, { token: 'WETH' })}
        </p>
        <p className="mas-menu-underline mb-4 cursor-pointer">
          {Intl.t(`get-tokens.card.link`)}
        </p>
      </GradientCard>
      <GradientCard customClass="w-72 h-80">
        <Tag
          type="default"
          content={Intl.t(`get-tokens.tag.ETH`)}
          customClass="mb-4"
        />
        <p className="mas-menu-default text-center mb-4">
          {Intl.t(`get-tokens.card.ETH-description`)}
        </p>
        <p className="mas-menu-underline mb-4 cursor-pointer">
          {Intl.t(`get-tokens.card.link`)}
        </p>
      </GradientCard>
    </div>
  );
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
          <EVMToMassaContent />
        ) : (
          <MassaToEVMContent />
        )}
      </PopupModalContent>
    </PopupModal>
  );
}
