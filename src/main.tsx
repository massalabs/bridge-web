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

import { ENV } from './const';
import { EvmWalletContext } from './contexts/EvmWalletContext';
import { ClaimPage } from './pages/ClaimPage/ClaimPage';
import { HistoryPage } from './pages/History/HistoryPage';
import { Base } from '@/components';
import { PAGES } from '@/const/pages/pages';
import { Error, NotFound, Index, Unavailable, SCDeploy } from '@/pages/index';

const baseENV = import.meta.env.VITE_ENV;

if ([ENV.DEV, ENV.TEST].includes(baseENV)) {
  const { mockServer } = await import('./mirage');
  mockServer(baseENV);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={PAGES.SC_DEPLOY} element={<SCDeploy />} />
      <Route path={PAGES.UNAVAILABLE} element={<Unavailable />} />
      <Route element={<Base />}>
        {/* routes for pages */}
        <Route path={PAGES.INDEX} element={<Index />} />
        <Route path={PAGES.CLAIM} element={<ClaimPage />} />
        <Route path={PAGES.HISTORY} element={<HistoryPage />} />

        {/* routes for errors */}
        <Route path="error" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      ,
    </>,
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
