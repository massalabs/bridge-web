import { MASSA_STATION } from '@/const';
import { FetchingStatus } from '@/pages/Index/Loading';
import { linkToCreateWallet, linkToInstall } from '@/utils/const';
import { providers } from '@massalabs/wallet-provider';
import { useEffect, useState } from 'react';

export function MassaConnectError({ ...props }) {
  const { accounts } = props;
  const [isMassaStationConnected, setIsMassaStationConnected] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<JSX.Element | null>(null);

  async function getSomething() {
    const providerList = await providers();
    const massaStationWallet = providerList.find(
      (provider: any) => provider.name() === MASSA_STATION,
    );
    setIsMassaStationConnected(!!massaStationWallet);
    if (!isMassaStationConnected) {
      setIsMassaStationConnected(!!massaStationWallet);
      setErrorMessage(<ErrorMassaStation />);
    } else if (isMassaStationConnected && accounts?.length <= 0) {
      setErrorMessage(<ErrorWallet />);
    }
  }

  useEffect(() => {
    getSomething();
  }, [isMassaStationConnected]);
  // TODO : change to a better conditional
  return <>{errorMessage === null ? <FetchingStatus /> : errorMessage}</>;
}

export function ErrorMassaStation() {
  return (
    <div className="truncate max-w-10 mas-body">
      Please{' '}
      <a href={linkToInstall} target="_blank">
        <u>Download MassaStation</u>
      </a>{' '}
      in order to connect your wallet.
    </div>
  );
}

export function ErrorWallet() {
  return (
    <div className="truncate max-w-10 mas-body">
      Please create a wallet at the following link{' '}
      <a href={linkToCreateWallet} target="_blank">
        <u>Download MassaStation</u>.
      </a>
    </div>
  );
}
