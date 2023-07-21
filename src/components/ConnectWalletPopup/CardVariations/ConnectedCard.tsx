import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';
import { SelectMassaWalletAccount } from '@/components';

export function ConnectedCard({ ...props }) {
  // This takes either massa walllet information or meta mask information
  const { account } = props;
  return (
    <div className="flex justify-between items-center gap-4">
      {/* <div className="flex justify-evenly items-center w-fit gap-4 bg-secondary px-4 py-3 rounded-xl">
        <MassaLogo />
        {account?.name()}
      </div> */}
      <SelectMassaWalletAccount {...props} />
      <div className="flex flex-col">
        <div className="truncate max-w-10 mas-body">
          {Intl.t('connect-wallet.connected-cards.wallet-address')}
          {maskAddress(account?.address().toString())}
        </div>
      </div>
    </div>
  );
}
