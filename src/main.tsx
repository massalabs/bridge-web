import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import '@massalabs/react-ui-kit/src/global.css';
import './index.css';

// import { ENV } from '@/const/env/env';
import { EvmWalletContext } from './contexts/EvmWalletContext';
import { Base, Network } from '@/components';
// import { mockServer } from '@/mirage';
import { PAGES } from '@/const/pages/pages';
import { Error, NotFound, Index } from '@/pages/index';

// const baseENV = import.meta.env.VITE_ENV;

// if ([ENV.DEV, ENV.TEST].includes(baseENV)) {
//   mockServer(baseENV);
// }

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Base />}>
      <Route path=":network" element={<Network />}>
        {/* routes for pages */}
        <Route path={PAGES.INDEX} element={<Index />} />
      </Route>

      {/* routes for errors */}
      <Route path="error" element={<Error />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <EvmWalletContext>
        <RouterProvider router={router} fallbackElement={<Error />} />
      </EvmWalletContext>
    </QueryClientProvider>
  </React.StrictMode>,
);
