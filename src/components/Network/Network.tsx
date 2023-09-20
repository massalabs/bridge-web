import { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useNetworkStore } from '@/store/store';

export function Network() {
  const navigate = useNavigate();

  const [currentNetwork] = useNetworkStore((state) => [state.currentNetwork]);

  useEffect(() => {
    navigate(`/${currentNetwork}/index`);
  }, [currentNetwork]);

  return <Outlet />;
}
