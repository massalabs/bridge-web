import Intl from '@/i18n/i18n';

import { GradientCard } from '@/components';
import {
  PopupModal,
  PopupModalHeader,
  PopupModalContent,
  Tag,
} from '@massalabs/react-ui-kit';

interface GetTokensModalProps {
  setOpenModal: (open: boolean) => void;
}

export function GetTokensPopUpModal(props: GetTokensModalProps) {
  const { setOpenModal } = props;

  return (
    <PopupModal
      fullMode={true}
      onClose={() => setOpenModal(false)}
      customClass="max-w-fit"
      customClassNested="border border-tertiary bg-secondary/50 backdrop-blur-lg"
    >
      <PopupModalHeader>
        <h1 className="mas-title mb-4 text-f-primary">
          {Intl.t('get-tokens.title')}
        </h1>
      </PopupModalHeader>
      <PopupModalContent>
        <div className="flex items-start justify-center gap-5 mt-5 mb-10">
          <GradientCard customClass="w-72 h-80">
            <Tag
              type="warning"
              content={Intl.t(`get-tokens.tag.tDAI`)}
              customClass="m-5"
            />
            <p className="mas-menu-default text-center m-5">
              {Intl.t(`get-tokens.card.tDAI-description`)}
            </p>
            <p className="mas-menu-underline m-5 cursor-pointer">
              {Intl.t(`get-tokens.card.link`)}
            </p>
          </GradientCard>
          <GradientCard customClass="w-72 h-80">
            <Tag
              type="default"
              content={Intl.t(`get-tokens.tag.WETH`)}
              customClass="m-5"
            />
            <p className="mas-menu-default text-center m-5">
              {Intl.t(`get-tokens.card.WETH-description`)}
            </p>
            <p className="mas-menu-underline m-5 cursor-pointer">
              {Intl.t(`get-tokens.card.link`)}
            </p>
          </GradientCard>
          <GradientCard customClass="w-72 h-80">
            <Tag
              type="default"
              content={Intl.t(`get-tokens.tag.ETH`)}
              customClass="m-5"
            />
            <p className="mas-menu-default text-center m-5">
              {Intl.t(`get-tokens.card.ETH-description`)}
            </p>
            <p className="mas-menu-underline m-5 cursor-pointer">
              {Intl.t(`get-tokens.card.link`)}
            </p>
          </GradientCard>
        </div>
      </PopupModalContent>
    </PopupModal>
  );
}
