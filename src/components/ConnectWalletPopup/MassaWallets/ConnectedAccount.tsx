import { Clipboard } from '@massalabs/react-ui-kit';
import { useAccountStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';

export function ConnectedAccount() {
  const { connectedAccount } = useAccountStore();

  return (
    <div className="flex flex-col w-full">
      <Clipboard
        customClass="h-14 rounded-lg text-center !mas-body"
        rawContent={connectedAccount?.address() ?? ''}
        displayedContent={maskAddress(connectedAccount?.address() ?? '')}
      />
    </div>
  );
}
