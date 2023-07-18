import { Button, Dropdown } from '@massalabs/react-ui-kit';

export function SelectMassaWalletAccount({ ...props }) {
  const { setIsMassaConnected, options } = props;

  return (
    <div className="flex flex-col gap-4">
      <Dropdown options={options} />
      <Button onClick={() => setIsMassaConnected(true)}>
        Select This Account
      </Button>
    </div>
  );
}
