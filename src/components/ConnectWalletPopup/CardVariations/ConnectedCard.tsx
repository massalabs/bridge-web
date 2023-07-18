import { maskAddress } from '@/utils/massaFormat';

export function ConnectedCard({ ...props }) {
  // This takes either massa walllet information or meta mask information
  // We will need to make sure the formatiting works for both

  const { walletName, walletAddress, icon, setIsMassaConnected } = props;
  const formattedWalletName = maskAddress(walletAddress);
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex justify-evenly items-center gap-2 w-full bg-secondary p-4 rounded-xl">
        {icon}
        {walletName}
      </div>
      <div className="flex flex-col">
        <div className="truncate max-w-10">
          Wallet address : {formattedWalletName}
        </div>
        <div>
          <u
            className="cursor-pointer"
            onClick={() => setIsMassaConnected(false)}
          >
            Change Wallet
          </u>
        </div>
      </div>
    </div>
  );
}