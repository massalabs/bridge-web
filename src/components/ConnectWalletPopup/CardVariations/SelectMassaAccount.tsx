import { Button, Dropdown } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';

export function SelectMassaWalletAccount({ ...props }) {
  const { setIsMassaConnected, options } = props;

  return (
    <div className="flex flex-col gap-4">
      <Dropdown options={options} />
      <Button onClick={() => setIsMassaConnected(true)}>
        {Intl.t('general.select-this-account')}
      </Button>
    </div>
  );
}
